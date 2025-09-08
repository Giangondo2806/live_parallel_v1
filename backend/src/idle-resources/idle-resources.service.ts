import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import type { Response } from 'express';
import { IdleResource } from './entities/idle-resource.entity';
import {
  CreateIdleResourceDto,
  UpdateIdleResourceDto,
  SearchCriteriaDto,
  IdleResourceResponseDto,
  PaginatedIdleResourceResponseDto,
  ImportResultDto,
  ExportFilterDto
} from './dto';

@Injectable()
export class IdleResourcesService {
  constructor(
    @InjectRepository(IdleResource)
    private idleResourceRepository: Repository<IdleResource>,
  ) {}

  async findAll(
    searchCriteria: SearchCriteriaDto, 
    userRole?: string, 
    userDeptId?: number
  ): Promise<PaginatedIdleResourceResponseDto> {
    const { 
      page = 1, 
      pageSize = 20, 
      search, 
      departmentId, 
      status, 
      idleFromStart,
      idleFromEnd,
      urgent,
      sortBy = 'updatedAt',
      sortOrder = 'DESC'
    } = searchCriteria;

    // Build query with joins
    const queryBuilder = this.idleResourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.department', 'department')
      .leftJoinAndSelect('resource.createdByUser', 'createdByUser')
      .leftJoinAndSelect('resource.updatedByUser', 'updatedByUser')
      .leftJoin('resource.cvFiles', 'cvFiles')
      .addSelect('COUNT(cvFiles.id)', 'cvFilesCount')
      .groupBy('resource.id, department.id, createdByUser.id, updatedByUser.id');

    // Apply role-based filtering
    if (userRole === 'manager' && userDeptId) {
      queryBuilder.andWhere('resource.departmentId = :userDeptId', { userDeptId });
    }

    // Apply basic search filters (enhanced from T-S03-001)
    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      queryBuilder.andWhere(
        '(LOWER(resource.fullName) LIKE :search OR ' +
        'LOWER(resource.employeeCode) LIKE :search OR ' +
        'LOWER(resource.skillSet) LIKE :search OR ' +
        'LOWER(resource.position) LIKE :search)',
        { search: searchTerm }
      );
    }

    if (departmentId) {
      queryBuilder.andWhere('resource.departmentId = :departmentId', { departmentId });
    }

    if (status) {
      queryBuilder.andWhere('resource.status = :status', { status });
    }

    if (idleFromStart) {
      queryBuilder.andWhere('resource.idleFrom >= :idleFromStart', { idleFromStart });
    }

    if (idleFromEnd) {
      queryBuilder.andWhere('resource.idleFrom <= :idleFromEnd', { idleFromEnd });
    }

    // Filter urgent resources (idle >= 2 months)
    if (urgent) {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      queryBuilder.andWhere('resource.idleFrom <= :twoMonthsAgo', { twoMonthsAgo });
    }

    // Apply sorting
    const sortField = this.getSortField(sortBy);
    queryBuilder.orderBy(sortField, sortOrder);

    // Get total count
    const totalQuery = queryBuilder.clone();
    const total = await totalQuery.getCount();

    // Apply pagination
    const skip = (page - 1) * pageSize;
    const resources = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getRawAndEntities();

    // Transform to response DTOs
    const data = resources.entities.map((resource, index) => {
      const raw = resources.raw[index];
      return this.transformToResponseDto(resource, parseInt(raw.cvFilesCount) || 0);
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async search(
    searchCriteria: SearchCriteriaDto,
    userRole?: string,
    userDeptId?: number
  ): Promise<PaginatedIdleResourceResponseDto> {
    // Enhanced search implementation for T-S03-002
    const {
      page = 1,
      pageSize = 20,
      search,
      departmentId,
      status,
      idleFromStart,
      idleFromEnd,
      urgent,
      sortBy = 'updatedAt',
      sortOrder = 'DESC'
    } = searchCriteria;

    // Build advanced search query with full-text search capabilities
    const queryBuilder = this.idleResourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.department', 'department')
      .leftJoinAndSelect('resource.createdByUser', 'createdByUser')
      .leftJoinAndSelect('resource.updatedByUser', 'updatedByUser')
      .leftJoin('resource.cvFiles', 'cvFiles')
      .addSelect('COUNT(cvFiles.id)', 'cvFilesCount')
      .groupBy('resource.id, department.id, createdByUser.id, updatedByUser.id');

    // Apply role-based filtering
    if (userRole === 'manager' && userDeptId) {
      queryBuilder.andWhere('resource.departmentId = :userDeptId', { userDeptId });
    }

    // Enhanced search with multiple field matching and ranking
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      
      // Add weighted search across multiple fields
      queryBuilder.andWhere(
        `(
          LOWER(resource.fullName) LIKE :search OR 
          LOWER(resource.employeeCode) LIKE :search OR 
          LOWER(resource.skillSet) LIKE :search OR
          LOWER(resource.position) LIKE :search OR
          LOWER(resource.email) LIKE :search OR
          LOWER(department.name) LIKE :search
        )`,
        { search: searchPattern }
      );

      // Add search relevance scoring for better results
      queryBuilder.addSelect(
        `(
          CASE 
            WHEN LOWER(resource.employeeCode) LIKE :exactSearch THEN 100
            WHEN LOWER(resource.fullName) LIKE :exactSearch THEN 90
            WHEN LOWER(resource.employeeCode) LIKE :search THEN 80
            WHEN LOWER(resource.fullName) LIKE :search THEN 70
            WHEN LOWER(resource.position) LIKE :search THEN 60
            WHEN LOWER(department.name) LIKE :search THEN 50
            WHEN LOWER(resource.skillSet) LIKE :search THEN 40
            WHEN LOWER(resource.email) LIKE :search THEN 30
            ELSE 10
          END
        )`,
        'searchRelevance'
      ).setParameter('exactSearch', `${searchTerm.toLowerCase()}`);
    }

    // Department filter
    if (departmentId) {
      queryBuilder.andWhere('resource.departmentId = :departmentId', { departmentId });
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere('resource.status = :status', { status });
    }

    // Date range filters
    if (idleFromStart) {
      queryBuilder.andWhere('resource.idleFrom >= :idleFromStart', { idleFromStart });
    }

    if (idleFromEnd) {
      queryBuilder.andWhere('resource.idleFrom <= :idleFromEnd', { idleFromEnd });
    }

    // Urgent resources filter (idle >= 2 months)
    if (urgent) {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      queryBuilder.andWhere('resource.idleFrom <= :twoMonthsAgo', { twoMonthsAgo });
    }

    // Apply sorting with search relevance priority
    if (search && search.trim()) {
      queryBuilder.orderBy('searchRelevance', 'DESC');
      if (sortBy !== 'relevance') {
        queryBuilder.addOrderBy(this.getSortField(sortBy), sortOrder);
      }
    } else {
      queryBuilder.orderBy(this.getSortField(sortBy), sortOrder);
    }

    // Get total count for pagination
    const totalQuery = queryBuilder.clone();
    if (search && search.trim()) {
      // Remove search relevance from count query
      totalQuery.select('COUNT(DISTINCT resource.id)', 'count');
    }
    const total = await totalQuery.getCount();

    // Apply pagination
    const skip = (page - 1) * pageSize;
    const resources = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getRawAndEntities();

    // Transform to response DTOs with search highlighting
    const data = resources.entities.map((resource, index) => {
      const raw = resources.raw[index];
      const dto = this.transformToResponseDto(resource, parseInt(raw.cvFilesCount) || 0);
      
      // Add search highlighting if search term provided
      if (search && search.trim()) {
        dto.searchHighlight = this.addSearchHighlight(dto, search.trim());
        dto.searchRelevance = parseInt(raw.searchRelevance) || 0;
      }
      
      return dto;
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  // Helper method to get proper sort field
  private getSortField(sortBy: string): string {
    const sortMapping: Record<string, string> = {
      'fullName': 'resource.fullName',
      'employeeCode': 'resource.employeeCode',
      'departmentName': 'department.name',
      'position': 'resource.position',
      'status': 'resource.status',
      'idleFrom': 'resource.idleFrom',
      'rate': 'resource.rate',
      'createdAt': 'resource.createdAt',
      'updatedAt': 'resource.updatedAt',
    };

    return sortMapping[sortBy] || 'resource.updatedAt';
  }

  // Helper method to add search highlighting for better UX (T-S03-002)
  private addSearchHighlight(
    dto: IdleResourceResponseDto, 
    searchTerm: string
  ): IdleResourceResponseDto['searchHighlight'] {
    const highlight: IdleResourceResponseDto['searchHighlight'] = {};
    const term = searchTerm.toLowerCase();

    // Helper function to wrap matched text with highlight markers
    const wrapMatches = (text: string, searchTerm: string): string => {
      if (!text) return text;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    // Check each field for matches and add highlighting
    if (dto.fullName && dto.fullName.toLowerCase().includes(term)) {
      highlight.fullName = wrapMatches(dto.fullName, searchTerm);
    }

    if (dto.employeeCode && dto.employeeCode.toLowerCase().includes(term)) {
      highlight.employeeCode = wrapMatches(dto.employeeCode, searchTerm);
    }

    if (dto.skillSet && dto.skillSet.toLowerCase().includes(term)) {
      highlight.skillSet = wrapMatches(dto.skillSet, searchTerm);
    }

    if (dto.position && dto.position.toLowerCase().includes(term)) {
      highlight.position = wrapMatches(dto.position, searchTerm);
    }

    if (dto.department?.name && dto.department.name.toLowerCase().includes(term)) {
      highlight.department = wrapMatches(dto.department.name, searchTerm);
    }

    return highlight;
  }

  // Helper method to transform entity to response DTO
  private transformToResponseDto(resource: IdleResource, cvFilesCount: number): IdleResourceResponseDto {
    return {
      id: resource.id,
      employeeCode: resource.employeeCode,
      fullName: resource.fullName,
      departmentId: resource.departmentId,
      department: {
        id: resource.department.id,
        name: resource.department.name,
        code: resource.department.code || '',
      },
      position: resource.position,
      email: resource.email,
      skillSet: resource.skillSet,
      idleFrom: resource.idleFrom,
      idleTo: resource.idleTo,
      status: resource.status,
      processNote: resource.processNote,
      rate: resource.rate ? parseFloat(resource.rate.toString()) : undefined,
      isUrgent: resource.isUrgent,
      cvFilesCount,
      createdBy: resource.createdBy,
      updatedBy: resource.updatedBy,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  async findOne(id: number): Promise<IdleResourceResponseDto> {
    // TODO: Add caching for frequently accessed resources
    // TODO: Check user permissions for viewing this specific resource
    // TODO: Log resource view activity for audit trail
    // TODO: Include related CV files and history in response
    // TODO: Calculate and return computed fields (isUrgent, etc.)
    
    const resource = await this.idleResourceRepository.findOne({
      where: { id },
      relations: ['department', 'createdByUser', 'updatedByUser', 'cvFiles'],
    });

    if (!resource) {
      throw new NotFoundException(`Idle resource with ID ${id} not found`);
    }

    // Convert entity to DTO - this should be implemented properly
    throw new Error('Method not implemented - DTO conversion needed');
  }

  async create(createIdleResourceDto: CreateIdleResourceDto, userId: number): Promise<IdleResourceResponseDto> {
    // TODO: Validate employee code uniqueness across all resources
    // TODO: Check user permissions for creating resources in specified department
    // TODO: Validate department exists and user has access
    // TODO: Implement business rules validation (e.g., idle date not in future)
    // TODO: Send notification to relevant stakeholders (department manager, etc.)
    // TODO: Create initial history log entry for resource creation
    // TODO: Handle concurrent creation attempts gracefully
    
    throw new Error('Method not implemented');
  }

  async update(id: number, updateIdleResourceDto: UpdateIdleResourceDto, userId: number): Promise<IdleResourceResponseDto> {
    // TODO: Check if resource exists and user has permission to update
    // TODO: Validate employee code uniqueness if being changed
    // TODO: Implement business rules for status transitions
    // TODO: Track what fields are being changed for history logging
    // TODO: Create detailed history log entry with before/after values
    // TODO: Send notifications for significant status changes
    // TODO: Handle concurrent update conflicts with optimistic locking
    // TODO: Validate rate changes and approval requirements
    
    throw new Error('Method not implemented');
  }

  async remove(id: number, userId: number): Promise<void> {
    // TODO: Check if resource exists and user has permission to delete
    // TODO: Implement soft delete instead of hard delete for audit trail
    // TODO: Check for dependencies (CV files, history logs, active assignments)
    // TODO: Archive related data before deletion
    // TODO: Create deletion history log entry
    // TODO: Send notification to relevant stakeholders
    // TODO: Clean up orphaned CV files and related data
    
    throw new Error('Method not implemented');
  }

  async bulkDelete(ids: number[], userId: number): Promise<{ deletedCount: number; errors: string[] }> {
    // TODO: Validate user permissions for each resource individually
    // TODO: Check dependencies for each resource before deletion
    // TODO: Implement transaction to ensure atomic bulk operation
    // TODO: Create bulk history log entries for audit trail
    // TODO: Handle partial failures gracefully (some succeed, some fail)
    // TODO: Send bulk notification summary to user
    // TODO: Archive related data for all deleted resources
    // TODO: Return detailed results with success/failure breakdown
    
    throw new Error('Method not implemented');
  }

  async importFromExcel(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
    // TODO: Validate Excel file format and required columns
    // TODO: Parse Excel file and validate each row's data
    // TODO: Check for duplicate employee codes within file and database
    // TODO: Validate department references and user access permissions
    // TODO: Implement batch processing for large files
    // TODO: Create detailed import log with success/failure details
    // TODO: Handle partial imports (some rows succeed, some fail)
    // TODO: Send import summary email to user with results
    // TODO: Create history log entries for all imported resources
    // TODO: Clean up temporary files after processing
    
    throw new Error('Method not implemented');
  }

  async exportToExcel(exportFilter: ExportFilterDto, res: Response): Promise<void> {
    // TODO: Apply user role-based filtering to export data
    // TODO: Implement custom column selection for export
    // TODO: Generate Excel file with proper formatting and headers
    // TODO: Include summary statistics and charts in export
    // TODO: Add export metadata (export date, user, filters applied)
    // TODO: Stream large exports to handle memory efficiently
    // TODO: Create audit log entry for data export
    // TODO: Send export completion notification to user
    // TODO: Support multiple export formats (Excel, CSV, PDF)
    
    throw new Error('Method not implemented');
  }

  // Keep existing simple methods for backward compatibility
  async findAllSimple(): Promise<IdleResource[]> {
    return this.idleResourceRepository.find({
      relations: ['department', 'createdByUser', 'updatedByUser'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOneSimple(id: number): Promise<IdleResource | null> {
    return this.idleResourceRepository.findOne({
      where: { id },
      relations: ['department', 'createdByUser', 'updatedByUser', 'cvFiles'],
    });
  }
}

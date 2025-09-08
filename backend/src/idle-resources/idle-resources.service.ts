import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import type { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { IdleResource } from './entities/idle-resource.entity';
import { Department } from '../departments/entities/department.entity';
import { User } from '../users/entities/user.entity';
import { ResourceStatus } from '../common/types';
import {
  CreateIdleResourceDto,
  UpdateIdleResourceDto,
  SearchCriteriaDto,
  IdleResourceResponseDto,
  PaginatedIdleResourceResponseDto,
  ImportResultDto
} from './dto';

@Injectable()
export class IdleResourcesService {
  constructor(
    @InjectRepository(IdleResource)
    private idleResourceRepository: Repository<IdleResource>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    // Apply search filters
    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      queryBuilder.andWhere(
        '(LOWER(resource.fullName) LIKE :search OR ' +
        'LOWER(resource.employeeCode) LIKE :search OR ' +
        'LOWER(resource.skillSet) LIKE :search)',
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

  async search(searchCriteria: SearchCriteriaDto): Promise<PaginatedIdleResourceResponseDto> {
    // For task T-S03-001, search is the same as findAll
    // This will be enhanced in T-S03-002 for advanced search functionality
    return this.findAll(searchCriteria);
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
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.includes('spreadsheet') && !file.mimetype.includes('excel')) {
      throw new BadRequestException('Invalid file format. Please upload an Excel file.');
    }

    try {
      // Parse Excel file
      const workbook = new ExcelJS.Workbook();
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      await workbook.xlsx.read(bufferStream);
      
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        throw new BadRequestException('Excel file must contain at least one worksheet');
      }

      const results: ImportResultDto = {
        successCount: 0,
        errorCount: 0,
        errors: [],
        totalProcessed: 0
      };

      const rows: any[] = [];
      let headerRow: any[] = [];

      // Read all rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          // Header row
          headerRow = row.values as any[];
        } else {
          // Data rows
          const rowData = row.values as any[];
          if (rowData && rowData.length > 1) { // Skip empty rows
            rows.push({ rowNumber, data: rowData });
          }
        }
      });

      // Validate headers
      const expectedHeaders = ['Employee Code', 'Full Name', 'Department', 'Position', 'Email', 'Skill Set', 'Idle From', 'Rate', 'Status'];
      const actualHeaders = headerRow.slice(1); // Remove first empty element
      
      const missingHeaders = expectedHeaders.filter((header, index) => 
        !actualHeaders[index] || actualHeaders[index].toString().toLowerCase() !== header.toLowerCase()
      );

      if (missingHeaders.length > 0) {
        throw new BadRequestException(`Missing or incorrect headers: ${missingHeaders.join(', ')}`);
      }

      results.totalProcessed = rows.length;

      // Process each data row
      for (const { rowNumber, data } of rows) {
        try {
          // Extract data from row (skip first empty element)
          const [, employeeCode, fullName, departmentName, position, email, skillSet, idleFromStr, rateStr, status] = data;

          // Validate required fields
          if (!employeeCode || !fullName || !departmentName || !position || !idleFromStr || !status) {
            results.errors.push(`Row ${rowNumber}: Missing required fields`);
            results.errorCount++;
            continue;
          }

          // Check if employee code already exists
          const existingResource = await this.idleResourceRepository.findOne({
            where: { employeeCode: employeeCode.toString() }
          });

          if (existingResource) {
            results.errors.push(`Row ${rowNumber}: Employee code '${employeeCode}' already exists`);
            results.errorCount++;
            continue;
          }

          // Find department
          const department = await this.departmentRepository.findOne({
            where: { name: departmentName.toString() }
          });

          if (!department) {
            results.errors.push(`Row ${rowNumber}: Department '${departmentName}' not found`);
            results.errorCount++;
            continue;
          }

          // Parse idle from date
          let idleFrom: Date;
          try {
            idleFrom = new Date(idleFromStr.toString());
            if (isNaN(idleFrom.getTime())) {
              throw new Error('Invalid date');
            }
          } catch (error) {
            results.errors.push(`Row ${rowNumber}: Invalid date format for 'Idle From'. Use YYYY-MM-DD format`);
            results.errorCount++;
            continue;
          }

          // Parse rate
          let rate: number | undefined;
          if (rateStr && rateStr.toString().trim()) {
            rate = parseFloat(rateStr.toString());
            if (isNaN(rate)) {
              results.errors.push(`Row ${rowNumber}: Invalid rate format`);
              results.errorCount++;
              continue;
            }
          }

          // Create resource
          const newResource = this.idleResourceRepository.create({
            employeeCode: employeeCode.toString().trim(),
            fullName: fullName.toString().trim(),
            departmentId: department.id,
            position: position.toString().trim(),
            email: email ? email.toString().trim() : null,
            skillSet: skillSet ? skillSet.toString().trim() : null,
            idleFrom,
            rate,
            status: status.toString().trim() as ResourceStatus,
            createdBy: userId,
            updatedBy: userId,
            isUrgent: false // Will be calculated automatically
          });

          await this.idleResourceRepository.save(newResource);
          results.successCount++;

        } catch (error) {
          results.errors.push(`Row ${rowNumber}: ${error.message}`);
          results.errorCount++;
        }
      }

      return results;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Excel import failed: ${error.message}`);
    }
  }

  async exportToExcel(exportFilter: SearchCriteriaDto, res: Response): Promise<void> {
    try {
      // Use same filtering logic as findAll method
      const queryBuilder = this.idleResourceRepository
        .createQueryBuilder('resource')
        .leftJoinAndSelect('resource.department', 'department')
        .leftJoinAndSelect('resource.createdByUser', 'createdByUser')
        .leftJoinAndSelect('resource.updatedByUser', 'updatedByUser');

      // Apply search filters (same as findAll method)
      if (exportFilter.search) {
        queryBuilder.andWhere(
          '(resource.fullName LIKE :search OR resource.employeeCode LIKE :search OR resource.skillSet LIKE :search)',
          { search: `%${exportFilter.search}%` }
        );
      }

      if (exportFilter.departmentId) {
        queryBuilder.andWhere('resource.departmentId = :departmentId', { 
          departmentId: exportFilter.departmentId 
        });
      }

      if (exportFilter.status) {
        queryBuilder.andWhere('resource.status = :status', { status: exportFilter.status });
      }

      if (exportFilter.urgent) {
        const urgentDate = new Date();
        urgentDate.setMonth(urgentDate.getMonth() - 2);
        queryBuilder.andWhere('resource.idleFrom <= :urgentDate', { urgentDate });
      }

      if (exportFilter.idleFromStart) {
        queryBuilder.andWhere('resource.idleFrom >= :idleFromStart', { 
          idleFromStart: exportFilter.idleFromStart 
        });
      }

      if (exportFilter.idleFromEnd) {
        queryBuilder.andWhere('resource.idleFrom <= :idleFromEnd', { 
          idleFromEnd: exportFilter.idleFromEnd 
        });
      }

      // Apply sorting
      const sortField = this.getSortField(exportFilter.sortBy || 'updatedAt');
      const sortOrder = exportFilter.sortOrder || 'DESC';
      queryBuilder.orderBy(sortField, sortOrder as any);

      // Get all matching resources
      const resources = await queryBuilder.getMany();

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Idle Resources');

      // Define headers
      const headers = [
        'Employee Code',
        'Full Name',
        'Department',
        'Position',
        'Email',
        'Skill Set',
        'Idle From',
        'Idle To',
        'Status',
        'Rate (JPY/h)',
        'Process Note',
        'Created Date',
        'Updated Date'
      ];

      // Add headers
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell, index) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4472C4' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Helper function to safely format dates
      const formatDate = (date: any): string => {
        if (!date) return '';
        try {
          const dateObj = typeof date === 'string' ? new Date(date) : date;
          return dateObj instanceof Date && !isNaN(dateObj.getTime()) 
            ? dateObj.toISOString().split('T')[0] 
            : '';
        } catch (error) {
          return '';
        }
      };

      // Add data rows
      resources.forEach(resource => {
        const row = worksheet.addRow([
          resource.employeeCode,
          resource.fullName,
          resource.department?.name || '',
          resource.position,
          resource.email || '',
          resource.skillSet || '',
          formatDate(resource.idleFrom),
          formatDate(resource.idleTo),
          resource.status,
          resource.rate || '',
          resource.processNote || '',
          formatDate(resource.createdAt),
          formatDate(resource.updatedAt)
        ]);

        // Add borders to data cells
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        // Highlight urgent resources
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        
        // Safely check if resource is urgent
        let isUrgent = false;
        if (resource.idleFrom) {
          try {
            const idleFromDate = typeof resource.idleFrom === 'string' 
              ? new Date(resource.idleFrom) 
              : resource.idleFrom;
            isUrgent = idleFromDate instanceof Date && !isNaN(idleFromDate.getTime()) 
              && idleFromDate <= twoMonthsAgo;
          } catch (error) {
            // Skip highlighting if date parsing fails
            isUrgent = false;
          }
        }
        
        if (isUrgent) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFF2CC' } // Light orange for urgent
            };
          });
        }
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        column.width = 15;
      });

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=idle-resources-export-${new Date().toISOString().split('T')[0]}.xlsx`
      );

      // Write to response
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('Excel export error:', error);
      throw new BadRequestException(`Excel export failed: ${error.message}`);
    }
  }

  async generateImportTemplate(res: Response): Promise<void> {
    try {
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Resource Import Template');

      // Define column headers
      const headers = [
        'Employee Code',
        'Full Name',
        'Department',
        'Position',
        'Email',
        'Skill Set',
        'Idle From',
        'Rate',
        'Status'
      ];

      // Add headers to the first row
      const headerRow = worksheet.addRow(headers);
      
      // Style the header row
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4472C4' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Add sample data row
      const sampleData = [
        'E001', 
        'John Doe', 
        'IT Department', 
        'Senior Developer', 
        'john.doe@company.com',
        'Java, Spring Boot, React', 
        '2024-01-15', 
        '5000', 
        'idle'
      ];
      
      const sampleRow = worksheet.addRow(sampleData);
      sampleRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        };
      });

      // Set column widths
      worksheet.columns.forEach((column) => {
        column.width = 18;
      });

      // Add instructions worksheet
      const instructionsSheet = workbook.addWorksheet('Instructions');
      const instructions = [
        ['Import Instructions'],
        [''],
        ['1. Employee Code: Must be unique (required)'],
        ['2. Full Name: Employee full name (required)'],
        ['3. Department: Exact department name (required)'],
        ['4. Position: Job title (required)'],
        ['5. Email: Valid email address (optional)'],
        ['6. Skill Set: Comma-separated skills (optional)'],
        ['7. Idle From: Date in YYYY-MM-DD format (required)'],
        ['8. Rate: Hourly rate in JPY (optional)'],
        ['9. Status: idle, processing, assigned, unavailable (required)'],
        [''],
        ['Notes:'],
        ['- Do not modify the header row'],
        ['- Delete the sample data row before importing'],
        ['- Ensure department names match exactly'],
        ['- Maximum 1000 rows per import']
      ];

      instructions.forEach((row, index) => {
        const addedRow = instructionsSheet.addRow(row);
        if (index === 0) {
          addedRow.font = { bold: true, size: 14 };
        } else if (row[0] && (row[0].toString().match(/^\d+\./) || row[0].toString() === 'Notes:')) {
          addedRow.font = { bold: true };
        }
      });

      instructionsSheet.columns[0].width = 50;

      // Set response headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=idle-resources-import-template.xlsx');

      // Write workbook to response
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('Template generation error:', error);
      throw new BadRequestException(`Template generation failed: ${error.message}`);
    }
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

import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Res
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiConsumes,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { IdleResourcesService } from './idle-resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  CreateIdleResourceDto, 
  UpdateIdleResourceDto, 
  SearchCriteriaDto, 
  IdleResourceResponseDto,
  PaginatedIdleResourceResponseDto 
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Idle Resources')
@Controller('idle-resources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IdleResourcesController {
  constructor(private readonly idleResourcesService: IdleResourcesService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of idle resources with filters' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of idle resources retrieved successfully',
    type: PaginatedIdleResourceResponseDto
  })
  @ApiQuery({ name: 'searchTerm', required: false, description: 'Search in name, employee code, or skills' })
  @ApiQuery({ name: 'departmentId', required: false, description: 'Filter by department ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by resource status' })
  @ApiQuery({ name: 'urgentOnly', required: false, description: 'Show only urgent resources (idle >= 2 months)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async findAll(
    @Query() searchCriteria: SearchCriteriaDto,
    @CurrentUser() user: User
  ): Promise<PaginatedIdleResourceResponseDto> {
    return this.idleResourcesService.findAllWithPagination(searchCriteria, user);
  }

  @Get('search')
  @ApiOperation({ summary: 'Advanced search for idle resources' })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results retrieved successfully',
    type: [IdleResourceResponseDto]
  })
  async search(@Query() searchCriteria: SearchCriteriaDto): Promise<IdleResourceResponseDto[]> {
    return this.idleResourcesService.searchResources(searchCriteria);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export idle resources to Excel/CSV' })
  @ApiResponse({ status: 200, description: 'Export file generated successfully' })
  @ApiQuery({ name: 'format', required: false, description: 'Export format (excel or csv)', enum: ['excel', 'csv'] })
  async exportResources(
    @Query() searchCriteria: SearchCriteriaDto,
    @Query('format') format: 'excel' | 'csv' = 'excel',
    @Res() res: Response,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.idleResourcesService.exportResources(searchCriteria, format, res, user);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import idle resources from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Import completed successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async importFromExcel(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User
  ): Promise<{ message: string; imported: number; errors: string[] }> {
    return this.idleResourcesService.importFromExcel(file, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get idle resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resource retrieved successfully',
    type: IdleResourceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IdleResourceResponseDto> {
    return this.idleResourcesService.findOneById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new idle resource' })
  @ApiResponse({ 
    status: 201, 
    description: 'Resource created successfully',
    type: IdleResourceResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createIdleResourceDto: CreateIdleResourceDto,
    @CurrentUser() user: User
  ): Promise<IdleResourceResponseDto> {
    return this.idleResourcesService.createResource(createIdleResourceDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update idle resource' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resource updated successfully',
    type: IdleResourceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIdleResourceDto: UpdateIdleResourceDto,
    @CurrentUser() user: User
  ): Promise<IdleResourceResponseDto> {
    return this.idleResourcesService.updateResource(id, updateIdleResourceDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete idle resource' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 204, description: 'Resource deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.idleResourcesService.removeResource(id, user);
  }

  @Delete('batch')
  @ApiOperation({ summary: 'Delete multiple idle resources' })
  @ApiResponse({ status: 200, description: 'Resources deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async batchDelete(
    @Body('ids') ids: number[],
    @CurrentUser() user: User
  ): Promise<{ deleted: number; errors: string[] }> {
    return this.idleResourcesService.batchDeleteResources(ids, user);
  }
}

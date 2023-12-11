import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '../auth/guard/auth.guard';
import {
  AddCorsOriginDto,
  AddTokenDto,
  CreateProjectDto,
  UpdateProjectDto,
} from './dto';
import { ProjectsService } from './projects.service';

@SkipThrottle()
@ApiTags('projects')
@ApiHeader({
  name: 'x-access-token',
  required: true,
  example: 'Bearer .....',
})
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create project' })
  @Post()
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto, req.user);
  }

  @ApiOperation({ summary: 'Get all projects with your uid' })
  @ApiQuery({ name: 'offset', example: 0 })
  @ApiQuery({ name: 'limit', example: 10 })
  @Get()
  findAll(
    @Request() req,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.projectsService.findAll(req.user.uid, offset, limit);
  }

  @ApiOperation({ summary: 'Get project by projectId' })
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @Get(':projectId')
  findOne(@Request() req, @Param('projectId') projectId: string) {
    return this.projectsService.findOne(projectId, req.user.uid);
  }

  @ApiOperation({ summary: 'Update project by projectId' })
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @Patch(':projectId')
  update(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(
      projectId,
      req.user.uid,
      updateProjectDto,
    );
  }

  @ApiOperation({ summary: 'Delete project by projectId' })
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @Delete(':projectId')
  remove(@Request() req, @Param('projectId') projectId: string) {
    return this.projectsService.remove(projectId, req.user.uid);
  }

  @ApiOperation({ summary: 'Get project database credentials by projectId' })
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @Get('/database-credentials/:projectId')
  getDatabaseCredentials(
    @Request() req,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.getDatabaseCredentials(projectId, req.user.uid);
  }

  @ApiOperation({ summary: 'Get project collection data' })
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @ApiQuery({ name: 'database', example: 'cockroachdb' })
  @ApiQuery({ name: 'collectionName', example: 'users' })
  @ApiQuery({ name: 'offset', example: 0 })
  @ApiQuery({ name: 'limit', example: 10 })
  @Get('/collection/:projectId')
  getCollectionData(
    @Request() req,
    @Param('projectId') projectId: string,
    @Query('database') database: string,
    @Query('collectionName') collectionName: string,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.projectsService.getCollectionData(
      projectId,
      req.user.uid,
      database,
      collectionName,
      offset,
      limit,
    );
  }

  @ApiOperation({ summary: 'Add a origin to the project' })
  @Post(':projectId/add-cors-origin')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  addCorsOrigin(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() addCorsOriginDto: AddCorsOriginDto,
  ) {
    return this.projectsService.addCorsOrigin(
      projectId,
      req.user.uid,
      addCorsOriginDto,
    );
  }

  @ApiOperation({ summary: 'Remove a origin from the project' })
  @Delete(':projectId/remove-cors-origin/:corsOriginId')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @ApiParam({
    name: 'cors origin id',
    example: 'd40e80a1-aae5-59d7-9841-2f58794ea805',
  })
  removeCorsOrigin(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('corsOriginId') corsOriginId: string,
  ) {
    return this.projectsService.removeCorsOrigin(
      projectId,
      req.user.uid,
      corsOriginId,
    );
  }

  @ApiOperation({ summary: 'Add a token to the project' })
  @Post(':projectId/add-token')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  addToken(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() addTokenDto: AddTokenDto,
  ) {
    return this.projectsService.addToken(projectId, req.user.uid, addTokenDto);
  }

  @ApiOperation({ summary: 'Remove a token from the project' })
  @Delete(':projectId/remove-token/:tokenId')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @ApiParam({
    name: 'token id',
    example: 'd40e80a1-aae5-59d7-9841-2f58794ea805',
  })
  removeToken(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.projectsService.removeToken(projectId, req.user.uid, tokenId);
  }

  // TODO: Invite project members

  // TODO: Delete member from project
}

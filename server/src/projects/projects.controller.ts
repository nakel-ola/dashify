import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
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
  AcceptMemberInviteDto,
  AddCorsOriginDto,
  AddNewDocumentDto,
  AddTokenDto,
  CreateNewCollectionDto,
  CreateProjectDto,
  DeleteDocumentDto,
  EditCollectionDto,
  InviteMemberDto,
  UpdateDocumentDto,
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

  @ApiOperation({ summary: 'Get project by projectId' })
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @Get(':projectId/by-invitation')
  findOneByInvitation(@Request() req, @Param('projectId') projectId: string) {
    return this.projectsService.findOneByInvitation(projectId, req.user);
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
  @Get(':projectId/database-credentials')
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
  @Get(':projectId/collection/')
  getCollectionData(
    @Request() req,
    @Param('projectId') projectId: string,
    @Query('database') database: string,
    @Query('collectionName') collectionName: string,
    @Query('sort') sort: string,
    @Query('filter') filter: string,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.projectsService.getCollectionData({
      projectId,
      uid: req.user.uid,
      database,
      collectionName,
      sort,
      filter,
      offset,
      limit,
    });
  }

  @ApiOperation({ summary: 'Create new collection or table' })
  @Post(':projectId/create-new-collection')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  createNewCollection(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() createNewCollectionDto: CreateNewCollectionDto,
  ) {
    return this.projectsService.createNewCollection(
      projectId,
      req.user.uid,
      createNewCollectionDto,
    );
  }

  @ApiOperation({ summary: 'Delete collection or table' })
  @Delete(':projectId/delete-collection/:collectionName')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @ApiParam({ name: 'collectionName', example: 'users' })
  deleteCollection(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('collectionName') collectionName: string,
  ) {
    return this.projectsService.deleteCollection(
      projectId,
      req.user.uid,
      collectionName,
    );
  }

  @ApiOperation({ summary: 'Refetch collections or tables' })
  @Get(':projectId/refetch-collections')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  refetchCollections(@Request() req, @Param('projectId') projectId: string) {
    return this.projectsService.refetchCollections(projectId, req.user.uid);
  }

  @ApiOperation({ summary: 'Edit collections or tables' })
  @Put(':projectId/edit-collection/')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  editCollection(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() editCollectionDto: EditCollectionDto,
  ) {
    return this.projectsService.editCollection(
      projectId,
      req.user.uid,
      editCollectionDto,
    );
  }

  @ApiOperation({ summary: 'Add new document to a collection' })
  @Post(':projectId/add-new-document')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  addNewDocument(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() addNewDocumentDto: AddNewDocumentDto,
  ) {
    return this.projectsService.addNewDocument(
      projectId,
      req.user.uid,
      addNewDocumentDto,
    );
  }

  @ApiOperation({ summary: 'Update document in a collection' })
  @Post(':projectId/update-document')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  updateDocument(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.projectsService.updateDocument(
      projectId,
      req.user.uid,
      updateDocumentDto,
    );
  }

  @ApiOperation({ summary: 'Delete documents from collection' })
  @Delete(':projectId/delete-documents')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  deleteDocuments(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() deleteDocumentDto: DeleteDocumentDto,
  ) {
    return this.projectsService.deleteDocuments(
      projectId,
      req.user.uid,
      deleteDocumentDto,
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

  @ApiOperation({ summary: 'Invite user' })
  @Post(':projectId/invite-member')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  inviteMember(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() inviteMemberDto: InviteMemberDto[],
  ) {
    return this.projectsService.inviteMember(
      projectId,
      req.user,
      inviteMemberDto,
    );
  }

  @ApiOperation({ summary: 'Accept invite' })
  @Post(':projectId/accept-member-invite')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  acceptMemberInvite(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() acceptMemberInviteDto: AcceptMemberInviteDto,
  ) {
    return this.projectsService.acceptMemberInvite(
      projectId,
      req.user,
      acceptMemberInviteDto,
    );
  }

  @ApiOperation({ summary: 'Get all invited members' })
  @Get(':projectId/invited-members')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  invitedMembers(@Request() req, @Param('projectId') projectId: string) {
    return this.projectsService.invitedMembers(projectId, req.user.uid);
  }

  @ApiOperation({
    summary: 'Remove an invited member from the project invitation',
  })
  @Delete(':projectId/remove-invite-member/:inviteId')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @ApiParam({
    name: 'invite id',
    example: 'd40e80a1-aae5-59d7-9841-2f58794ea805',
  })
  removeInviteMember(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.projectsService.removeInviteMember(
      projectId,
      req.user.uid,
      inviteId,
    );
  }

  @ApiOperation({
    summary: 'Remove a member from the project',
  })
  @Delete(':projectId/remove-member/:memberId')
  @ApiParam({ name: 'projectId', example: 'finance-tracker-78493' })
  @ApiParam({
    name: 'invite id',
    example: 'd40e80a1-aae5-59d7-9841-2f58794ea805',
  })
  removeMember(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.projectsService.removeMember(projectId, req.user.uid, memberId);
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import clean from '../common/clean';
import Cryptr from '../common/cryptr';
import { getDatabaseCollections } from '../common/getDatabaseCollections';
import { User } from '../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { getCockroachdbTable } from './common/getCockroachdbTable';
import { getMongodbCollection } from './common/getMongodbCollection';
import { getMysqlTable } from './common/getMysqlTable';
import { getPostgresTable } from './common/getPostgresTable';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities';
import { Collection } from './types/collection.type';
import { InvitationType, Member, ProjectType } from './types/project.type';
import {
  AcceptMemberInviteDto,
  AddCorsOriginDto,
  AddTokenDto,
  InviteMemberDto,
} from './dto';
import { v4 } from 'uuid';
import { customAlphabet, nanoid } from '../common/nanoid';
import { MailerService } from '@nestjs-modules/mailer';
// import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private configService: ConfigService,
    private usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const { database, projectId, name, logo, databaseConfig } =
      createProjectDto;

    const dbCollections = await getDatabaseCollections(createProjectDto);

    const key = this.configService.get('PROJECT_DATABASE_SECRET');
    const cryptr = new Cryptr(key);

    const collections: Collection[] = [
      { name: 'overview', icon: 'Category', fields: [] },
      ...dbCollections,
    ];

    const date = new Date();

    const data = {
      name,
      database,
      logo,
      members: [
        {
          uid: user.uid,
          role: 'administrator' as const,
          createdAt: date,
          updatedAt: date,
        },
      ],
      projectId,
      databaseConfig: {
        name: cryptr.encrypt(databaseConfig.name),
        host: cryptr.encrypt(databaseConfig.host),
        dbType: database,
        port: cryptr.encrypt(`${databaseConfig.port}`),
        username: cryptr.encrypt(databaseConfig.username),
        password: cryptr.encrypt(databaseConfig.password),
      },
      collections,
      corsOrigins: [],
      tokens: [],
    };

    const project = await this.projectRepository.save({ ...data });

    const formattedProject = await this.formatProject(project);

    return formattedProject;
  }

  async findAll(uid: string, offset: number, limit: number) {
    const where = { members: { $elemMatch: { uid } } } as any;
    const projects = await this.projectRepository.find({
      where,
      skip: offset,
      take: limit,
    });

    const newProjects = [];

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];

      const item = await this.formatProject(project);

      newProjects.push(item);
    }

    const totalItems = await this.projectRepository.countBy(where);

    return { totalItems, results: newProjects };
  }

  async findOne(projectId: string, uid: string) {
    const project = await this.projectRepository.findOne({
      where: { members: { $elemMatch: { uid } } as any, projectId },
    });

    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found`);

    const newProject = await this.formatProject(project);
    return newProject;
  }

  async findOneByInvitation(projectId: string, user: User) {
    const project = await this.projectRepository.findOne({
      where: {
        projectId,
        $or: [
          { invitations: { $elemMatch: { email: user.email } } },
          { members: { $elemMatch: { uid: user.uid } } },
        ],
      } as any,
    });

    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found`);

    const newProject = await this.formatProject(project);
    return newProject;
  }

  async update(
    projectId: string,
    uid: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.findOne(projectId, uid);

    const isAdministrator = this.isMemberAdministrator(project.members, uid);

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    await this.projectRepository.update({ projectId }, clean(updateProjectDto));

    return { message: 'Project updated successfully' };
  }

  async remove(projectId: string, uid: string) {
    await this.projectRepository.delete({
      projectId,
      members: { $elemMatch: { uid, role: 'administrator' } } as any,
    });
    return { message: 'Project deleted successfully' };
  }

  async getDatabaseCredentials(projectId: string, uid: string) {
    const project = await this.projectRepository.findOne({
      where: { members: { uid }, projectId },
      select: ['databaseConfig'],
    });

    return this.decryptDatabaseConfig(project.databaseConfig);
  }

  async getCollectionData(
    projectId: string,
    uid: string,
    database: string,
    collectionName: string,
    offset: number,
    limit: number,
  ) {
    const dbConfig = await this.getDatabaseCredentials(projectId, uid);

    const args = { ...dbConfig, collectionName, offset, limit };

    if (database === 'mongodb') {
      return await getMongodbCollection(args);
    } else if (database === 'cockroachdb') {
      return await getCockroachdbTable(args);
    } else if (database === 'postgres') {
      return await getPostgresTable(args);
    } else if (database === 'sqlite') {
      return await getMysqlTable(args);
    }
    return {};
  }

  async addCorsOrigin(
    projectId: string,
    uid: string,
    addCorsOriginDto: AddCorsOriginDto,
  ) {
    const project = await this.findOne(projectId, uid);

    const isAdministrator = this.isMemberAdministrator(project.members, uid);

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    const date = new Date();

    await this.projectRepository.update(
      { projectId },
      {
        corsOrigins: [
          ...project.corsOrigins,
          {
            id: v4(),
            ...addCorsOriginDto,
            creatorId: uid,
            createdAt: date,
            updatedAt: date,
          },
        ],
      },
    );
    return { message: 'Cors Origin Added Successfully' };
  }

  async removeCorsOrigin(projectId: string, uid: string, corsOriginId: string) {
    const project = await this.findOne(projectId, uid);

    const isAdministrator = this.isMemberAdministrator(project.members, uid);

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    const corsOrigins = project.corsOrigins.filter(
      (corsOrigin) => corsOrigin.id !== corsOriginId,
    );

    await this.projectRepository.update({ projectId }, { corsOrigins });
    return { message: 'Cors Origin Removed Successfully' };
  }

  async addToken(projectId: string, uid: string, addTokenDto: AddTokenDto) {
    const project = await this.findOne(projectId, uid);
    const isAdministrator = this.isMemberAdministrator(project.members, uid);

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    const token = nanoid(184);
    const date = new Date();

    await this.projectRepository.update(
      { projectId },
      {
        tokens: [
          ...project.tokens,
          {
            id: v4(),
            ...addTokenDto,
            token,
            creatorId: uid,
            createdAt: date,
            updatedAt: date,
          },
        ],
      },
    );
    return { token, message: 'Token Added Successfully' };
  }

  async removeToken(projectId: string, uid: string, tokenId: string) {
    const project = await this.findOne(projectId, uid);

    const isAdministrator = this.isMemberAdministrator(project.members, uid);

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    const tokens = project.tokens.filter((token) => token.id !== tokenId);

    await this.projectRepository.update({ projectId }, { tokens });
    return { message: 'Token Removed Successfully' };
  }

  async inviteMember(
    projectId: string,
    user: User,
    inviteMemberDto: InviteMemberDto[],
  ) {
    const project = await this.findOne(projectId, user.uid);

    const isAdministrator = this.isMemberAdministrator(
      project.members,
      user.uid,
    );

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    const filteredUsers = await this.filteredMemberInvite(
      project.invitations,
      inviteMemberDto,
      user.uid,
    );

    const returnMsg = { message: 'Invitation sent Successfully' };

    if (filteredUsers.length === 0) return returnMsg;

    const name = user.lastName + ' ' + user.firstName;

    for (let i = 0; i < filteredUsers.length; i++) {
      const filteredUser = filteredUsers[i];

      await this.mailerService.sendMail({
        to: filteredUser.email,
        subject: `${name} has invited you to ${project.name} on Dashify`,
        template: 'project-member-invite',
        context: {
          name,
          projectName: project.name,
          link:
            this.getClientURL() +
            `/project/invite/${projectId}/${filteredUser.code}`,
        },
      });
    }

    await this.projectRepository.update(
      { projectId },
      {
        invitations: [
          ...project.invitations,
          ...filteredUsers.map((filteredUser) =>
            clean({ ...filteredUser, code: null }),
          ),
        ],
      },
    );
    return returnMsg;
  }

  async acceptMemberInvite(
    projectId: string,
    user: User,
    data: AcceptMemberInviteDto,
  ) {
    const { token } = data;

    const project = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found`);

    const savedToken = project.invitations.find(
      (invitation) => invitation.email === user.email,
    );

    if (!savedToken) throw new NotFoundException('TOKEN_NOT_FOUND');

    const isTokenAMatch = await bcrypt.compare(token, savedToken.token);

    if (!isTokenAMatch) throw new ConflictException("Can't validate token");

    const invitations = project.invitations.filter(
      (invitation) => invitation.id !== savedToken.id,
    );

    const date = new Date();

    const members: Member[] = [
      ...project.members,
      {
        uid: user.uid,
        role: savedToken.role,
        createdAt: date,
        updatedAt: date,
      },
    ];

    await this.projectRepository.update(
      { projectId },
      {
        invitations,
        members,
      },
    );

    return { message: 'Invitation accepted successfull' };
  }

  async invitedMembers(projectId: string, uid: string) {
    const project = await this.findOne(projectId, uid);

    return project.invitations;
  }

  async removeInviteMember(projectId: string, uid: string, inviteId: string) {
    const project = await this.findOne(projectId, uid);

    const isAdministrator = this.isMemberAdministrator(project.members, uid);

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    const invitations = project.invitations.filter(
      (invitation) => invitation.id !== inviteId,
    );

    await this.projectRepository.update({ projectId }, { invitations });
    return { message: 'User Removed Successfully' };
  }
  async removeMember(projectId: string, uid: string, memberId: string) {
    const project = await this.findOne(projectId, uid);

    const isAdministrator = this.isMemberAdministrator(project.members, uid);

    if (!isAdministrator) throw new UnauthorizedException('Permission denied');

    const members = project.members.filter((member) => member.uid !== memberId);

    await this.projectRepository.update({ projectId }, { members });
    return { message: 'User Removed Successfully' };
  }

  private async filteredMemberInvite(
    prev: InvitationType[],
    next: InviteMemberDto[],
    uid: string,
  ) {
    const arr: (InvitationType & { code: string })[] = [];

    const date = new Date();

    for (const user of next) {
      // Check if the user is already in the 'prev' array
      const userExists = prev.some((prevUser) => prevUser.email === user.email);

      // If the user does not exist in the 'prev' array, add it
      if (!userExists) {
        const nanoid = customAlphabet(
          '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
          40,
        );

        const code = nanoid();

        const salt = await bcrypt.genSalt();

        const token = await bcrypt.hash(code, salt);
        arr.push({
          id: v4(),
          ...user,
          token,
          code,
          creatorId: uid,
          createdAt: date,
          updatedAt: date,
        });
      }
    }

    return arr;
  }

  private isMemberAdministrator(members: Member[], uid: string) {
    const isAdministrator = !!members.find(
      (member) => member.uid === uid && member.role === 'administrator',
    );

    return isAdministrator;
  }

  private async formatProject(project: Project): Promise<ProjectType> {
    const memberIds = project.members.map((member) => member.uid);
    const users = await this.usersService.getUserByBatch(memberIds ?? []);

    const key = this.configService.get('PROJECT_DATABASE_SECRET');
    const cryptr = new Cryptr(key);

    const dbConfig = project.databaseConfig;

    const databaseConfig = {
      name: cryptr.decrypt(dbConfig.name),
      host: cryptr.decrypt(dbConfig.host),
      dbType: dbConfig.dbType,
      port: Number(cryptr.decrypt(dbConfig.port)),
      username: cryptr.decrypt(dbConfig.username),
      password: cryptr.decrypt(dbConfig.password),
    };

    const members = users.map((user) => {
      const member = project.members.find((member) => member.uid === user.uid)!;
      return {
        ...user,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };
    });
    return clean({ ...project, members, databaseConfig, userIds: null });
  }

  private decryptDatabaseConfig(databaseConfig: any) {
    const key = this.configService.get('PROJECT_DATABASE_SECRET');
    const cryptr = new Cryptr(key);

    return {
      name: cryptr.decrypt(databaseConfig.name),
      host: cryptr.decrypt(databaseConfig.host),

      port: Number(cryptr.decrypt(`${databaseConfig.port}`)),
      username: cryptr.decrypt(databaseConfig.username),
      password: cryptr.decrypt(databaseConfig.password),
    };
  }

  private getClientURL() {
    const origins = this.configService.get('ALLOWED_ORIGINS');

    const arr = JSON.parse(origins);

    return arr[0];
  }
}

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
import { getDatabaseCollections } from './common/getDatabaseCollections';
import { User } from '../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities';

import {
  AcceptMemberInviteDto,
  AddCorsOriginDto,
  AddTokenDto,
  CreateNewCollectionDto,
  EditCollectionDto,
  InviteMemberDto,
} from './dto';
import { v4 } from 'uuid';
import { customAlphabet, nanoid } from '../common/nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { MongoDatabase } from './common/mongodb';
import { CockroachDatabase } from './common/cockroachdb';
import { PostgresDatabase } from './common/postgres';
import { MySQLDatabase } from './common/mysql';

import type { DataType } from './common/query-generatore/mysql';
import type { Collection } from './types/project.type';
import type {
  DatabaseConfig,
  InvitationType,
  Member,
  ProjectType,
} from './types/project.type';

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

    const collections: Collection[] = await getDatabaseCollections({
      database,
      ...databaseConfig,
    });

    const key = this.configService.get('PROJECT_DATABASE_SECRET');
    const cryptr = new Cryptr(key);

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
      where: { members: { $elemMatch: { uid } } as any, projectId },
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

    const collectionArgs = { tableName: collectionName, offset, limit };

    if (database === 'mongodb') {
      const mongodb = new MongoDatabase(dbConfig);

      const results = await mongodb.getCollection({
        ...collectionArgs,
        collectionName: collectionArgs.tableName,
      });

      mongodb.close();
      return results;
    }

    if (database === 'cockroachdb') {
      const cockroachdb = new CockroachDatabase(dbConfig);

      const results = await cockroachdb.getTable(collectionArgs);

      cockroachdb.close();
      return results;
    }
    if (database === 'postgres') {
      const postgres = new PostgresDatabase(dbConfig);

      const results = await postgres.getTable(collectionArgs);

      postgres.close();
      return results;
    }

    if (database === 'mysql') {
      const mysql = new MySQLDatabase();

      await mysql.connect(dbConfig);

      const results = await mysql.getTable(collectionArgs);

      mysql.close();
      return results;
    }
    return { message: 'Database not supported' };
  }

  async createNewCollection(
    projectId: string,
    uid: string,
    createNewCollectionDto: CreateNewCollectionDto,
  ) {
    const { collectionName, column } = createNewCollectionDto;

    const project = await this.findOne(projectId, uid);

    const isViewer = this.isMemberViewer(project.members, uid);

    if (isViewer) throw new UnauthorizedException('Permission denied');

    const dbConfig = project.databaseConfig;

    const database = dbConfig.dbType;

    if (database === 'mongodb') {
      const mongodb = new MongoDatabase(dbConfig);

      await mongodb.createCollection(collectionName);

      await mongodb.close();
    }

    if (database === 'cockroachdb') {
      const cockroachdb = new CockroachDatabase(dbConfig);

      await cockroachdb.createTable(collectionName, column);

      await cockroachdb.close();
    }

    if (database === 'postgres') {
      const postgres = new PostgresDatabase(dbConfig);

      await postgres.createTable(collectionName, column);

      await postgres.close();
    }

    if (database === 'mysql') {
      const mysql = new MySQLDatabase();

      await mysql.connect(dbConfig);

      await mysql.createTable(collectionName, column as DataType[]);

      await mysql.close();
    }

    await this.updateCollection(projectId, project.databaseConfig);

    return { message: 'Collection created successfully' };
  }

  async deleteCollection(
    projectId: string,
    uid: string,
    collectionName: string,
  ) {
    const project = await this.findOne(projectId, uid);

    const isViewer = this.isMemberViewer(project.members, uid);

    if (isViewer) throw new UnauthorizedException('Permission denied');

    const dbConfig = project.databaseConfig;

    const database = project.database;

    if (database === 'mongodb') {
      const mongodb = new MongoDatabase(dbConfig);

      await mongodb.deleteCollection(collectionName);
      await mongodb.close();
    }

    if (database === 'cockroachdb') {
      const cockroachdb = new CockroachDatabase(dbConfig);

      await cockroachdb.deleteTable(collectionName);

      await cockroachdb.close();
    }

    if (database === 'postgres') {
      const postgres = new PostgresDatabase(dbConfig);

      await postgres.deleteTable(collectionName);

      await postgres.close();
    }

    if (database === 'mysql') {
      const mysql = new MySQLDatabase();

      await mysql.connect(dbConfig);

      await mysql.deleteTable(collectionName);

      await mysql.close();
    }

    await this.updateCollection(projectId, project.databaseConfig);

    return { message: 'Collection deleted successfully' };
  }

  async refetchCollection(projectId: string, uid: string) {
    const project = await this.findOne(projectId, uid);

    return await this.updateCollection(projectId, project.databaseConfig);
  }

  async editCollection(
    projectId: string,
    uid: string,
    editCollectionDto: EditCollectionDto,
  ) {
    const { collectionName, newCollectionName } = editCollectionDto;

    const project = await this.findOne(projectId, uid);

    const isViewer = this.isMemberViewer(project.members, uid);

    if (isViewer) throw new UnauthorizedException('Permission denied');

    const dbConfig = project.databaseConfig;

    const database = dbConfig.dbType;

    const args = {
      tableName: collectionName,
      newTableName: newCollectionName,
    };

    if (database === 'mongodb') {
      const mongodb = new MongoDatabase(dbConfig);

      await mongodb.changeCollectionName({ collectionName, newCollectionName });

      await mongodb.close();
    }

    if (database === 'cockroachdb') {
      const cockroachdb = new CockroachDatabase(dbConfig);

      await cockroachdb.editTable(args);

      await cockroachdb.close();
    }

    if (database === 'postgres') {
      const postgres = new PostgresDatabase(dbConfig);

      await postgres.editTable(args);

      await postgres.close();
    }

    if (database === 'mysql') {
      const mysql = new MySQLDatabase();

      await mysql.connect(dbConfig);

      await mysql.editTable(args);

      await mysql.close();
    }

    await this.updateCollection(projectId, project.databaseConfig);

    return { message: 'Collection updated successfully' };
  }

  async updateCollection(projectId: string, databaseConfig: DatabaseConfig) {
    const collections: Collection[] = await getDatabaseCollections({
      ...databaseConfig,
      database: databaseConfig.dbType,
    });

    await this.projectRepository.update({ projectId }, { collections });

    return collections;
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

  private isMemberEditor(members: Member[], uid: string) {
    const isEditor = !!members.find(
      (member) => member.uid === uid && member.role === 'editor',
    );

    return isEditor;
  }

  private isMemberViewer(members: Member[], uid: string) {
    const isViewer = !!members.find(
      (member) => member.uid === uid && member.role === 'viewer',
    );

    return isViewer;
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

  private decryptDatabaseConfig(databaseConfig: DatabaseConfig) {
    const key = this.configService.get('PROJECT_DATABASE_SECRET');
    const cryptr = new Cryptr(key);

    return {
      name: cryptr.decrypt(databaseConfig.name) as string,
      host: cryptr.decrypt(databaseConfig.host) as string,
      port: Number(cryptr.decrypt(`${databaseConfig.port}`)),
      dbType: databaseConfig.dbType,
      username: cryptr.decrypt(databaseConfig.username) as string,
      password: cryptr.decrypt(databaseConfig.password) as string,
    };
  }

  private getClientURL() {
    const origins = this.configService.get('ALLOWED_ORIGINS');

    const arr = JSON.parse(origins);

    return arr[0];
  }
}

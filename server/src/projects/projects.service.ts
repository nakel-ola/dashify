import {
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
import { ProjectType } from './types/project.type';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private configService: ConfigService,
    private usersService: UsersService,
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

    const data = {
      name,
      database,
      logo,
      members: [{ uid: user.uid, role: 'administrator' as const }],
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

  async update(
    projectId: string,
    uid: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.findOne(projectId, uid);

    const members = project.members;

    const isAdministrator = !!members.find(
      (member) => member.uid === uid && member.role === 'administrator',
    );

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

  private async formatProject(project: Project): Promise<ProjectType> {
    const memberIds = project.members.map((member) => member.uid);
    const users = await this.usersService.getUserByBatch(memberIds ?? []);

    const members = users.map((user) => ({
      ...user,
      role: project.members.find((member) => member.uid === user.uid)!.role,
    }));
    return clean({ ...project, members, databaseConfig: null, userIds: null });
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
}

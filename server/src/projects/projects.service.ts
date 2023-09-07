import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const { database, projectId, name, databaseConfig } = createProjectDto;

    const dbCollections = await getDatabaseCollections(createProjectDto);

    const key = this.configService.get('PROJECT_DATABASE_SECRET');
    const cryptr = new Cryptr(key);

    const collections: Collection[] = [
      { name: 'overviews', icon: 'Category', fields: [] },
      ...dbCollections,
    ];

    const data = {
      name,
      database,
      logo: null,
      userIds: [user.uid],
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

    const newProject = await this.formatProject(project);

    return newProject;
  }

  async findAll(uid: string, offset: number, limit: number) {
    const projects = await this.projectRepository.find({
      where: { userIds: uid },
      skip: offset,
      take: limit,
    });

    const newProjects = [];

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];

      const item = await this.formatProject(project);

      newProjects.push(item);
    }

    return newProjects;
  }

  async findOne(projectId: string, uid: string) {
    const project = await this.projectRepository.findOne({
      where: { userIds: uid, projectId },
    });

    const newProject = await this.formatProject(project);
    return newProject;
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    console.log(updateProjectDto);
    return `This action updates a #${id} project`;
  }

  async remove(projectId: string, uid: string) {
    await this.projectRepository.delete({ projectId, userIds: uid });
    return { message: 'Project deleted successfully' };
  }

  async getDatabaseCredentials(projectId: string, uid: string) {
    const project = await this.projectRepository.findOne({
      where: { userIds: uid, projectId },
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

  private async formatProject(project: Project) {
    const users = await this.usersService.getUserByBatch(project.userIds ?? []);
    return clean({ ...project, users, databaseConfig: null, userIds: null });
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

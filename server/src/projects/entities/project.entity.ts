import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

enum DatabaseType {
  MONGODB = 'mongodb',
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  COCKROACHDB = 'cockroachdb',
}

enum UserRole {
  OWNER = 'owner',
  COLLABORATOR = 'collaborator',
}

@Entity()
class DatabaseConfig {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  host: string;

  @Column({ nullable: false })
  port: number;

  @Column({ type: 'enum', enum: DatabaseType, nullable: false })
  dbType: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;
}

@Entity()
class Fields {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  type: string;
}

@Entity()
class Widgets {}

@Entity()
class Collection {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  icon: string | null;

  @Column({ nullable: false })
  fields: Fields[];

  @Column()
  widgets?: Widgets[];
}

@Entity()
class User {
  @Column({ unique: true })
  uid: string;

  @Column({ type: 'enum', enum: UserRole })
  role: 'owner' | 'collaborator';
}

@Entity('projects')
export class Project {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ nullable: false })
  projectId: string;

  @Column()
  logo: string | null;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  users: User[];

  @Column({ type: 'enum', enum: DatabaseType, nullable: false })
  database: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';

  @Column({ nullable: false })
  databaseConfig: DatabaseConfig;

  @Column({ nullable: false })
  collections: Collection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

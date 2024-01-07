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

enum MemberRole {
  ADMINISTRATOR = 'administrator',
  EDITOR = 'editor',
  VIEWER = 'viewer',
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

  @Column({ nullable: true })
  dataType: string;

  @Column({ nullable: true })
  udtName: string;

  @Column({ nullable: true })
  defaultValue: string;
}

@Entity()
class Collection {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  icon: string | null;

  @Column({ nullable: false })
  fields: Fields[];
}

@Entity()
class CorsOrigin {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ nullable: false })
  origin: string;

  @Column({ nullable: false })
  permission: string;

  @Column({ nullable: false })
  creatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
class Token {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  creatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
class Member {
  @Column({ unique: true })
  uid: string;

  @Column({ type: 'enum', enum: MemberRole })
  role: 'administrator' | 'editor' | 'viewer';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
class Invitation {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  token: string;

  @Column({ type: 'enum', enum: MemberRole })
  role: 'administrator' | 'editor' | 'viewer';

  @Column({ nullable: false })
  creatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
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
  members: Member[];

  @Column({ nullable: false })
  invitations: Invitation[];

  @Column({ nullable: false })
  corsOrigins: CorsOrigin[];

  @Column({ type: 'enum', enum: DatabaseType, nullable: false })
  database: 'mongodb' | 'postgres' | 'mysql' | 'cockroachdb';

  @Column({ nullable: false })
  databaseConfig: DatabaseConfig;

  @Column({ nullable: false })
  collections: Collection[];

  @Column({ nullable: false })
  tokens: Token[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

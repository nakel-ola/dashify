import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PROVIDER {
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
}

@Entity('users')
export class User {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ type: 'uuid' })
  uid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  photoUrl: string;

  @Column()
  emailVerified: boolean;

  @Column()
  password: string;

  @Column({ type: 'enum', array: true, enum: PROVIDER, nullable: false })
  providers: PROVIDER[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

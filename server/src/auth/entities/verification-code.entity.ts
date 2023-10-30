import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VerificationType {
  EMAIL = 'email',
  PASSWORD = 'password',
}

@Entity('verificationCodes')
export class VerificationCode {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  token: string;

  @Column()
  uid: string;

  @Column()
  type: VerificationType;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

  @Column({ unique: true })
  code: string;

  @Column()
  uid: string;

  @Column()
  type: VerificationType;

  @CreateDateColumn()
  @Index({ expireAfterSeconds: 600 })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

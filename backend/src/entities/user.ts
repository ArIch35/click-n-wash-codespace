import { Column, Entity, OneToMany } from 'typeorm';
import { array, boolean, object, string } from 'yup';
import BaseEntity from './base-entity';
import Contract from './contract';
import Laundromat from './laundromat';
import Message from './message';

@Entity()
class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email!: string;

  @Column()
  balance: number = 0;

  @Column()
  isAlsoVendor: boolean = false;

  @OneToMany(() => Laundromat, (laundromat) => laundromat.owner)
  laundromats?: Laundromat[];

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts?: Contract[];

  @OneToMany(() => Message, (message) => message.to)
  inbox?: Message[];
}

export default User;

export const createUserSchema = object({
  name: string().required(),
}).noUnknown(true);

export const updateUserSchema = object({
  name: string(),
  isAlsoVendor: boolean(),
})
  .noUnknown(true)
  .test('at-least-one-field', 'You must provide at least one field', (value) =>
    Object.values(value).some((field) => field !== undefined && field !== null),
  );

export const markAsReadSchema = object({
  messageIds: array().of(string().required()).required(),
}).noUnknown(true);

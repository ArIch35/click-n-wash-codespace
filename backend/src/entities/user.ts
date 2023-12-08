import { Column, Entity, OneToMany } from 'typeorm';
import { boolean, number, object, string } from 'yup';
import BaseEntity from './base-entity';
import Contract from './contract';
import Laundromat from './laundromat';

@Entity()
class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  credit!: number;

  @Column({ nullable: false })
  isAlsoVendor: boolean = false;

  @OneToMany(() => Laundromat, (laundromat) => laundromat.owner)
  laundromats?: Laundromat[];

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts?: Contract[];
}

export default User;

export const createUserSchema = object({
  email: string().email().required(),
  name: string().required(),
  credit: number().required(),
  isAlsoVendor: boolean(),
});

export const updateUserSchema = object({
  email: string().email(),
  name: string(),
  credit: number(),
  isAlsoVendor: boolean(),
})
.noUnknown(true)
.test('at-least-one-field', 'You must provide at least one field', (value) =>
  Object.values(value).some((field) => field !== undefined && field !== null),
);

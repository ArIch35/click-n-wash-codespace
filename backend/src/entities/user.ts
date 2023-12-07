import { Column, Entity, OneToMany } from 'typeorm';
import { number, object, string } from 'yup';
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
  firstname: string().required(),
  lastname: string().required(),
  credit: number().required(),
});

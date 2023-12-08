import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { number, object, string } from 'yup';
import BaseEntity from './base-entity';
import User from './user';
import WashingMachine from './washing-machine';

@Entity()
class Laundromat extends BaseEntity {
  @Column({ nullable: false })
  street!: string;

  @Column({ nullable: false })
  city!: string;

  @Column({ nullable: false })
  country!: string;

  @Column({ nullable: false })
  postalCode!: number;

  @Column({ nullable: false })
  price!: number;

  @ManyToOne(() => User, (user) => user.laundromats, { nullable: false })
  owner!: User;

  @OneToMany(() => WashingMachine, (washingMachine) => washingMachine.laundromat)
  washingMachines?: WashingMachine[];
}

export default Laundromat;

export const createLaundromatSchema = object({
  name: string().required(),
  street: string().required(),
  city: string().required(),
  country: string().required(),
  postalCode: number().required(),
  price: number().required(),
}).noUnknown(true);

export const updateLaundromatSchema = object({
  name: string(),
  street: string(),
  city: string(),
  country: string(),
  postalCode: number(),
  price: number(),
})
  .noUnknown()
  .test('at-least-one-field', 'You must provide at least one field', (value) =>
    Object.values(value).some((field) => field !== undefined && field !== null),
  );

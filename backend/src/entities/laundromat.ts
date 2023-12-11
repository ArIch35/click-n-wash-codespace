import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, Not, OneToMany } from 'typeorm';
import { number, object, string } from 'yup';
import getDb from '../db';
import StatusError from '../utils/error-with-status';
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

  @BeforeInsert()
  @BeforeUpdate()
  /**
   * Rules to check before inserting or updating a laundromat.
   */
  async rules(): Promise<void> {
    await checkDuplicateNameFromOtherUsers(this);
    await checkDuplicateAddress(this);
  }
}

export default Laundromat;

/**
 * Checks whether a laundromat with the same name and from other users exists in the database.
 * @param laundromat The laundromat to check.
 */
const checkDuplicateNameFromOtherUsers = async (laundromat: Laundromat): Promise<void> => {
  const existingLaundromat = await getDb().laundromatRepository.findOne({
    where: {
      name: laundromat.name,
      owner: {
        id: Not(laundromat.owner.id),
      },
    },
  });
  if (existingLaundromat) {
    throw new StatusError(`${laundromat.name} has already been taken by another user`, 409);
  }
};

/**
 * Checks whether a laundromat with the same address exists in the database.
 * @param laundromat The laundromat to check.
 */
const checkDuplicateAddress = async (laundromat: Laundromat): Promise<void> => {
  const existingLaundromat = await getDb().laundromatRepository.findOne({
    where: {
      id: Not(laundromat.id),
      street: laundromat.street,
      city: laundromat.city,
      country: laundromat.country,
      postalCode: laundromat.postalCode,
    },
  });
  if (existingLaundromat) {
    throw new StatusError(
      `Laundromat with address ${laundromat.street}, ${laundromat.city}, ${laundromat.country}, ${laundromat.postalCode} already exists`,
      409,
    );
  }
};

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

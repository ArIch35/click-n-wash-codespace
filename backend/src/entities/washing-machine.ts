import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { object, string } from 'yup';
import getDb from '../db';
import StatusError from '../utils/error-with-status';
import BaseEntity from './base-entity';
import Contract from './contract';
import Laundromat from './laundromat';

@Entity()
class WashingMachine extends BaseEntity {
  @Column({ nullable: false })
  brand!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Contract, (contract) => contract.washingMachine)
  contracts?: Contract[];

  @ManyToOne(() => Laundromat, (laundromat) => laundromat.washingMachines, { nullable: false })
  laundromat!: Laundromat;

  @BeforeInsert()
  @BeforeUpdate()
  /**
   * Rules to check before inserting or updating a laundromat.
   */
  async rules(): Promise<void> {
    await checkDuplicateNameWithinLaundromat(this);
  }
}

export default WashingMachine;

/**
 * Checks whether a washing machine with the same name and within the same laundromat exists in the database.
 * @param washingMachine The washing machine to check.
 */
const checkDuplicateNameWithinLaundromat = async (
  washingMachine: WashingMachine,
): Promise<void> => {
  const existingWashingMachine = await getDb().washingMachineRepository.findOne({
    where: {
      name: washingMachine.name,
      laundromat: {
        id: washingMachine.laundromat.id,
      },
    },
  });
  if (existingWashingMachine) {
    throw new StatusError(
      `Washing machine with name ${washingMachine.name} already exists in laundromat ${washingMachine.laundromat.name}`,
      409,
    );
  }
};

export const createWashingMaschineSchema = object({
  name: string().required(),
  brand: string().required(),
  description: string(),
  laundromat: string().required(),
}).noUnknown();

export const updateWashingMaschineSchema = object({
  name: string(),
  brand: string(),
  description: string(),
})
  .noUnknown()
  .test('at-least-one-field', 'You must provide at least one field', (value) =>
    Object.values(value).some((field) => field !== undefined && field !== null),
  );

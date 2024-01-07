import { AfterLoad, BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { date, object, string } from 'yup';
import getDb from '../db';
import { timeBuffer } from '../utils/constants';
import StatusError from '../utils/error-with-status';
import BaseEntity from './base-entity';
import User from './user';
import WashingMachine from './washing-machine';

type Status = 'ongoing' | 'finished' | 'cancelled';

@Entity()
class Contract extends BaseEntity {
  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  status: Status = 'ongoing';

  @Column()
  price!: number;

  @ManyToOne(() => User, (user) => user.contracts, { nullable: false })
  user!: User;

  @ManyToOne(() => WashingMachine, (washingMachine) => washingMachine.contracts, {
    nullable: false,
  })
  washingMachine!: WashingMachine;

  @BeforeInsert()
  /**
   * Rules to check before inserting a contract.
   */
  async rules(): Promise<void> {
    await checkAvailability(this.washingMachine, this.startDate, this.endDate);
    setName(this);
  }

  @AfterLoad()
  async updateStatus(): Promise<void> {
    if (this.status !== 'ongoing') {
      return;
    }
    const today = new Date();
    if (today > this.endDate) {
      this.status = 'finished';
      await getDb().contractRepository.update(this.id, { status: 'finished' });
    }
  }
}

export default Contract;

/**
 * Checks whether a washing machine is available within the time period
 * @param washingMachine The washing machine to check
 * @param startDate The start date of the time period
 * @param endDate The end date of the time period
 */
const checkAvailability = async (
  washingMachine: WashingMachine,
  startDate: Date,
  endDate: Date,
) => {
  const startDateBuffer = new Date(startDate.getTime() - timeBuffer);
  const endDateBuffer = new Date(endDate.getTime() + timeBuffer);
  const conflictingContract = await getDb()
    .contractRepository.createQueryBuilder('contract')
    .where('contract.washingMachine = :washingMachine', { washingMachine: washingMachine.id })
    .andWhere('contract.status = :status', { status: 'ongoing' })
    .andWhere(
      '(contract.startDate BETWEEN :startDateBuffer AND :endDateBuffer OR contract.endDate BETWEEN :startDateBuffer AND :endDateBuffer OR :startDateBuffer BETWEEN contract.startDate AND contract.endDate OR :endDateBuffer BETWEEN contract.startDate AND contract.endDate)',
      {
        startDateBuffer,
        endDateBuffer,
      },
    )
    .getOne();
  console.log('conflictingContract', conflictingContract);

  if (conflictingContract) {
    throw new StatusError(
      `Washing machine ${washingMachine.name} is not available within the time period`,
      409,
    );
  }
};

/**
 * Sets the name of a contract
 * @param contract The contract to set the name
 */
const setName = (contract: Contract): void => {
  contract.name = `Contract between ${contract.user.name} and ${
    contract.washingMachine.name
  } from ${contract.startDate.toISOString()} to ${contract.endDate.toISOString()} for ${
    contract.price
  }€`;
};

/**
 * Finalize a contract by using transaction to update both user and laundromat owner credit and contract status
 * @param contract The contract to be finalized
 * @param cancel Whether the contract is gonna be cancelled
 */
export const finalizeContract = async (contract: Contract, cancel?: boolean) => {
  await getDb().entityManager.transaction(async (transactionalEntityManager) => {
    // Update user credit if the user is not the owner of the laundromat
    if (contract.user.id !== contract.washingMachine.laundromat.owner.id) {
      // Check whether the contract is gonna be cancelled
      if (cancel) {
        contract.status = 'cancelled';
        contract.user.credit += contract.price;
        contract.washingMachine.laundromat.owner.credit -= contract.price;
      } else {
        contract.user.credit -= contract.price;
        contract.washingMachine.laundromat.owner.credit += contract.price;
      }
    }
    await transactionalEntityManager.save(contract.user);
    await transactionalEntityManager.save(contract.washingMachine.laundromat.owner);
    await transactionalEntityManager.save(contract);
  });
};

export const createContractSchema = object({
  startDate: date().required(),
  endDate: date().required(),
  washingMachine: string().required(),
})
  .test('is-valid-date', 'Start date must be before end date', (value) => {
    return value.startDate < value.endDate;
  })
  .test('is-in-future', 'Start date must be in the future', (value) => {
    return value.startDate > new Date();
  });

export const updateContractSchema = object({
  status: string().required(),
}).test('is-cancelled', 'Contract can only be cancelled', (value) => value.status === 'cancelled');

import { AfterLoad, BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { date, object, string } from 'yup';
import getDb from '../db';
import StatusError from '../utils/error-with-status';
import BalanceTransaction, { finalizeBalanceTransaction } from './balance-transaction';
import BaseEntity from './base-entity';
import User from './user';
import WashingMachine from './washing-machine';

type Status = 'ongoing' | 'finished' | 'cancelled';

@Entity()
class Contract extends BaseEntity {
  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({ type: 'timestamptz' })
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
    autoGenerateName(this);
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
  const conflictingContract = await getDb()
    .contractRepository.createQueryBuilder('contract')
    .where('contract.washingMachine = :washingMachine', { washingMachine: washingMachine.id })
    .andWhere('contract.status = :status', { status: 'ongoing' })
    .andWhere(
      '(contract.startDate BETWEEN :startDate AND :endDate OR contract.endDate BETWEEN :startDate AND :endDate OR :startDate BETWEEN contract.startDate AND contract.endDate OR :endDate BETWEEN contract.startDate AND contract.endDate)',
      {
        startDate,
        endDate,
      },
    )
    .getOne();

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
const autoGenerateName = (contract: Contract): void => {
  if (contract.name) {
    return;
  }
  contract.name = `Contract #${contract.id} for ${contract.washingMachine.name} with the price of ${contract.price}€`;
};

/**
 * Finalizes a contract or an array of contracts.
 * If the `cancel` parameter is set to `true`, the contract(s) will be cancelled and a refund will be created.
 *
 * @param contract - The contract or array of contracts to be finalized.
 * @param cancel - Optional. Set to `true` to cancel the contract(s) and create a refund. Defaults to `false`.
 * @returns A promise that resolves when the contract(s) have been finalized.
 */
export const finalizeContract = async (contract: Contract | Contract[], cancel?: boolean) => {
  await getDb().entityManager.transaction(async (transactionalEntityManager) => {
    const contracts = contract instanceof Array ? contract : [contract];
    const balanceTransactions: BalanceTransaction[] = [];

    for (const contract of contracts) {
      let name = `Contract #${contract.id}`;

      // Check whether the contract is gonna be cancelled
      if (cancel) {
        contract.status = 'cancelled';
        name = `Refund for ${name}`;
      }

      // Create balance transactions
      const senderBalance = getDb().balanceTransactionRepository.create({
        name,
        amount: contract.price * -1,
        user: cancel ? contract.washingMachine.laundromat.owner : contract.user,
      });
      const receiverBalance = getDb().balanceTransactionRepository.create({
        name,
        amount: contract.price,
        user: cancel ? contract.user : contract.washingMachine.laundromat.owner,
      });

      balanceTransactions.push(senderBalance, receiverBalance);
    }

    await finalizeBalanceTransaction(balanceTransactions, transactionalEntityManager);
    await transactionalEntityManager.save(contracts);
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

export const bulkCancelContractSchema = object({
  startDate: date().required(),
  endDate: date().required(),
  washingMachine: string().required(),
}).test('is-valid-date', 'Start date must be before end date', (value) => {
  return value.startDate < value.endDate;
});

export const reportContractSchema = object({
  reason: string().required(),
  description: string().required(),
});

import { BeforeInsert, Column, Entity, EntityManager, ManyToOne } from 'typeorm';
import { number, object } from 'yup';
import getDb from '../db';
import StatusError from '../utils/error-with-status';
import { STATUS_BAD_REQUEST } from '../utils/http-status-codes';
import BaseEntity from './base-entity';
import User from './user';

type TransactionType = 'topup' | 'payment' | 'refund';

@Entity()
class BalanceTransaction extends BaseEntity {
  @Column()
  amount!: number;

  @Column()
  type!: TransactionType;

  @ManyToOne(() => User)
  from?: User;

  @ManyToOne(() => User, { nullable: false })
  to!: User;

  @BeforeInsert()
  /**
   * Rules to check before inserting a balance transaction.
   */
  rules() {
    checkFromWithType(this.from, this.type);
    setName(this);
  }
}

export default BalanceTransaction;

/**
 * Checks whether a from user is specified for a transaction type
 * @param from From user
 * @param type Transaction type
 * @throws StatusError if the from user is specified for topup or if the from user is not specified for other types
 */
const checkFromWithType = (from: User | undefined, type: TransactionType) => {
  if (type === 'topup') {
    if (from !== undefined) {
      throw new StatusError('From must not be specified for topup', STATUS_BAD_REQUEST);
    }
    return;
  }

  if (from === undefined) {
    throw new StatusError('From must be specified for type other than topup', STATUS_BAD_REQUEST);
  }
};

/**
 * Sets the name of a balance transaction
 * @param balanceTransaction Balance transaction to set name
 */
const setName = (balanceTransaction: BalanceTransaction) => {
  const message = balanceTransaction.from
    ? `from ${balanceTransaction.from.id} to ${balanceTransaction.to.id}`
    : `to ${balanceTransaction.to.id}`;
  balanceTransaction.name = `${balanceTransaction.amount}€ ${message}`;
};

/**
 * Finalizes a balance transaction by updating the balances of the involved accounts and saving the transaction.
 * @param balanceTransaction - The balance transaction to be finalized.
 * @param transactionalEntityManager - Optional transactional entity manager to use for the operation (For using existing transaction).
 */
export const finalizeBalanceTransaction = async (
  balanceTransaction: BalanceTransaction,
  transactionalEntityManager?: EntityManager,
) => {
  const func = async (transactionalEntityManager: EntityManager) => {
    if (balanceTransaction.type === 'topup') {
      balanceTransaction.to.balance += balanceTransaction.amount;
    } else {
      balanceTransaction.from!.balance -= balanceTransaction.amount;
      balanceTransaction.to.balance += balanceTransaction.amount;
    }
    if (balanceTransaction.from) {
      if (balanceTransaction.from.balance < 0) {
        throw new StatusError('Insufficient balance', STATUS_BAD_REQUEST);
      }
      await transactionalEntityManager.save(balanceTransaction.from);
    }
    await transactionalEntityManager.save(balanceTransaction.to);
    await transactionalEntityManager.save(balanceTransaction);
  };

  if (transactionalEntityManager) {
    await func(transactionalEntityManager);
    return;
  }
  await getDb().entityManager.transaction(async (transactionalEntityManager) => {
    await func(transactionalEntityManager);
  });
};

export const createTopupSchema = object({
  amount: number().required(),
}).test('is-valid-amount', 'Amount must be greater than 0', (value) => {
  return value.amount > 0;
});

import { BeforeInsert, Column, Entity, EntityManager, ManyToOne } from 'typeorm';
import { number, object } from 'yup';
import getDb from '../db';
import StatusError from '../utils/error-with-status';
import { STATUS_BAD_REQUEST } from '../utils/http-status-codes';
import BaseEntity from './base-entity';
import User from './user';

type TransactionType = 'topup' | 'money sent' | 'money received';

@Entity()
class BalanceTransaction extends BaseEntity {
  @Column()
  amount!: number;

  @Column()
  type!: TransactionType;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @BeforeInsert()
  /**
   * Rules to check before inserting a balance transaction.
   */
  rules() {
    autoGenerateType(this);
    autoGenerateName(this);
  }
}

export default BalanceTransaction;

/**
 * Auto-generates the type for a balance transaction if it is not already set.
 * If the amount is greater than 0, sets the type to 'money received'.
 * Otherwise, sets the type to 'money sent'.
 * @param balanceTransaction - The balance transaction object to auto-generate the type for.
 */
const autoGenerateType = (balanceTransaction: BalanceTransaction) => {
  if (balanceTransaction.type) {
    return;
  }
  if (balanceTransaction.amount > 0) {
    balanceTransaction.type = 'money received';
  } else {
    balanceTransaction.type = 'money sent';
  }
};

/**
 * Auto-generates the name for a balance transaction if it is not already set.
 * The name is determined based on the type of the balance transaction.
 * @param balanceTransaction - The balance transaction object.
 */
const autoGenerateName = (balanceTransaction: BalanceTransaction) => {
  if (balanceTransaction.name) {
    return;
  }
  if (balanceTransaction.type === 'topup') {
    balanceTransaction.name = 'Topup';
  } else if (balanceTransaction.type === 'money sent') {
    balanceTransaction.name = 'Money sent';
  } else if (balanceTransaction.type === 'money received') {
    balanceTransaction.name = 'Money received';
  }
};

/**
 * Finalizes a balance transaction by updating the user's balance and saving the transaction.
 * @param balanceTransaction - The balance transaction to be finalized.
 * @param transactionalEntityManager - Optional transactional entity manager to use for the operation.
 */
export const finalizeBalanceTransaction = async (
  balanceTransaction: BalanceTransaction,
  transactionalEntityManager?: EntityManager,
) => {
  const func = async (transactionalEntityManager: EntityManager) => {
    const user = await transactionalEntityManager.findOne(User, {
      where: { id: balanceTransaction.user.id },
    });
    if (!user) {
      throw new StatusError('User not found', STATUS_BAD_REQUEST);
    }

    user.balance += balanceTransaction.amount;
    if (user.balance < 0) {
      throw new StatusError('Insufficient balance', STATUS_BAD_REQUEST);
    }
    balanceTransaction.user = user;
    await transactionalEntityManager.save(user);
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

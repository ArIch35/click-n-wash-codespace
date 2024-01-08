import BaseEntity from './base-entity';
import User from './user';

type TransactionType = 'topup' | 'payment' | 'refund';

interface BalanceTransaction extends BaseEntity {
  amount: number;
  type: TransactionType;
  from?: User;
  to: User;
}

export default BalanceTransaction;

import BaseEntity from './base-entity';

type TransactionType = 'topup' | 'money sent' | 'money received';

interface BalanceTransaction extends BaseEntity {
  amount: number;
  type: TransactionType;
}

export default BalanceTransaction;

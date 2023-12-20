import BaseEntity from './base-entity';
import User from './user';
import WashingMachine from './washing-machine';

type Status = 'ongoing' | 'finished' | 'cancelled';

interface Contract extends BaseEntity {
  startDate: Date;
  endDate: Date;
  status: Status;
  price: number;
  user: User;
  washingMachine: WashingMachine;
}

export default Contract;

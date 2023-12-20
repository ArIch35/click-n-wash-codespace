import BaseEntity from './base-entity';
import User from './user';
import WashingMachine from './washing-machine';

interface Laundromat extends BaseEntity {
  street: string;
  city: string;
  country: string;
  postalCode: number;
  price: number;
  owner: User;
  washingMachines?: WashingMachine[];
}

export default Laundromat;

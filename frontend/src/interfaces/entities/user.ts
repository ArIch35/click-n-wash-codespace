import BaseEntity from './base-entity';
import Contract from './contract';
import Laundromat from './laundromat';
import Message from './message';

interface User extends BaseEntity {
  email: string;
  balance: number;
  isAlsoVendor: boolean;
  laundromats?: Laundromat[];
  contracts?: Contract[];
  inbox?: Message[];
}

export type CreateUser = Pick<User, 'name'>;
export type UpdateUser = Partial<Pick<User, 'name' | 'isAlsoVendor'>>;

export default User;

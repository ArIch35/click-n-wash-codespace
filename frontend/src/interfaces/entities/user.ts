import BaseEntity from './base-entity';
import Laundromat from './laundromat';

interface User extends BaseEntity {
  email: string;
  balance: number;
  isAlsoVendor: boolean;
  laundromats: Laundromat[];
}

export type CreateUser = Pick<User, 'name'>;
export type UpdateUser = Partial<Pick<User, 'name' | 'isAlsoVendor'>>;

export default User;

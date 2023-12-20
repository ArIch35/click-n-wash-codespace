import BaseEntity from './base-entity';
import Laundromat from './laundromat';

interface User extends BaseEntity {
  email: string;
  credit: number;
  isAlsoVendor: boolean;
  laundromats: Laundromat[];
}

export default User;

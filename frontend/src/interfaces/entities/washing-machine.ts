import BaseEntity from './base-entity';
import Contract from './contract';
import Laundromat from './laundromat';

interface WashingMachine extends BaseEntity {
  brand: string;
  description?: string;
  contracts?: Contract[];
  laundromat: Laundromat;
}

export type CreateWashingMachine = Pick<WashingMachine, 'name' | 'brand' | 'description'> & {
  laundromat: string;
};

export type UpdateWashingMachine = Pick<WashingMachine, 'name' | 'brand' | 'description'>;

export default WashingMachine;

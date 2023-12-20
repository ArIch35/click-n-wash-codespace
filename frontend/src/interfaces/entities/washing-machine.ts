import BaseEntity from './base-entity';
import Contract from './contract';
import Laundromat from './laundromat';

interface WashingMachine extends BaseEntity {
  brand: string;
  description?: string;
  contracts?: Contract[];
  laundromat: Laundromat;
}

export default WashingMachine;

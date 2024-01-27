import { LatLngExpression } from 'leaflet';
import BaseEntity from './base-entity';
import User from './user';
import WashingMachine from './washing-machine';

interface Laundromat extends BaseEntity {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  price: number;
  owner: User;
  washingMachines?: WashingMachine[];
  lat?: string;
  lon?: string;
  position?: LatLngExpression;
}

export type CreateLaundromat = Pick<
  Laundromat,
  'name' | 'street' | 'city' | 'country' | 'postalCode' | 'price'
>;

export type GetLocationLaundromat = Pick<Laundromat, 'street' | 'city' | 'country' | 'postalCode'>;

export default Laundromat;

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

interface Chart {
  name: string;
  label: string;
  color: string;
}

export interface LaundromatAnalytics {
  laundromat: Laundromat;
  analytics: {
    date: string;
    revenue: number;
    totalFinishedContracts: number;
    totalOngoingContracts: number;
    totalCancelledContracts: number;
  }[];
  series: Chart[];
}

export type CreateLaundromat = Pick<
  Laundromat,
  'name' | 'street' | 'city' | 'country' | 'postalCode' | 'price'
>;

export type GetLocationLaundromat = Pick<Laundromat, 'street' | 'city' | 'country' | 'postalCode'>;

export type GetLaundromatAnalytics = { startDate: Date; endDate: Date; span: string };

export default Laundromat;

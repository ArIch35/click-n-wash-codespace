import { Column, Entity, ManyToOne } from 'typeorm';
import { object, string } from 'yup';
import BaseEntity from './base-entity';
import Laundromat from './laundromat';

@Entity()
class WashingMachine extends BaseEntity {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  brand!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Laundromat, (laundromat) => laundromat.washingMachines, { nullable: false })
  laundromat!: Laundromat;
}

export default WashingMachine;

export const createWashingMaschineSchema = object({
  name: string().required(),
  brand: string().required(),
  description: string(),
  laundromat: object().required(),
});

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { object, string } from 'yup';
import BaseEntity from './base-entity';
import Contract from './contract';
import Laundromat from './laundromat';

@Entity()
class WashingMachine extends BaseEntity {
  @Column({ nullable: false })
  brand!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Contract, (contract) => contract.washingMachine)
  contracts?: Contract[];

  @ManyToOne(() => Laundromat, (laundromat) => laundromat.washingMachines, { nullable: false })
  laundromat!: Laundromat;
}

export default WashingMachine;

export const createWashingMaschineSchema = object({
  name: string().required(),
  brand: string().required(),
  description: string(),
  laundromat: string().required(),
});

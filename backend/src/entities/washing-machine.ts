import { Column, Entity, ManyToOne } from 'typeorm';
import { object, string } from 'yup';
import BaseEntity from './base-entity';
import Address from './address';

@Entity()
class WashingMachine extends BaseEntity {
    @Column({nullable: false})
    name!:string

    @Column({nullable: true})
    description!:string

    @Column({nullable: false})
    brand!:string

    @ManyToOne(() => Address, (address) => address.washingMachines)
    address!: Address
}

export default WashingMachine;

export const RegisterWashingMaschineSchema = object({
  name: string().required(),
  description: string(),
  brand: string().required()
});

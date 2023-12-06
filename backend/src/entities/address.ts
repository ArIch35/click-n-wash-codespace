import { Column, Entity } from 'typeorm';
import { number, object, string } from 'yup';
import BaseEntity from './base-entity';

@Entity()
class Address extends BaseEntity {
  @Column({ nullable: false })
  street!: string;

  @Column({ nullable: false })
  city!: string;

  @Column({ nullable: false })
  country!: string;

  @Column({ nullable: false })
  postalCode!: number;
}

export default Address;

export const RegisterAddressSchema = object({
  street: string().required(),
  city: string().required(),
  country: string().required(),
  postalCode: number().required(),
});

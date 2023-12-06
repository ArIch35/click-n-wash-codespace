import { Column, Entity } from 'typeorm';
import { number, object, string } from 'yup';
import BaseEntity from './base-entity';

@Entity()
class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  firstname!: string;

  @Column({ nullable: false })
  lastname!: string;

  @Column({ nullable: false })
  credit!: number;

  @Column({ nullable: false })
  isAlsoVendor: boolean = false;
}

export default User;

export const RegisterUserSchema = object({
  email: string().email().required(),
  firstname: string().required(),
  lastname: string().required(),
  credit: number().required(),
});

import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm';
import { number, object, string } from 'yup';
import getDb from '../db';
import BaseEntity from './base-entity';
import User from './user';
import WashingMachine from './washing-machine';

type Status = 'ongoing' | 'finished' | 'cancelled';

@Entity()
class Contract extends BaseEntity {
  @Column({ nullable: false })
  startDate!: Date;

  @Column({ nullable: false })
  endDate!: Date;

  @Column({ nullable: false })
  status: Status = 'ongoing';

  @Column({ nullable: false })
  price!: number;

  @ManyToOne(() => User, (user) => user.contracts, { nullable: false })
  user!: User;

  @ManyToOne(() => WashingMachine, (washingMachine) => washingMachine.contracts, {
    nullable: false,
  })
  washingMachine!: WashingMachine;

  @AfterLoad()
  async updateStatus(): Promise<void> {
    if (this.status !== 'ongoing') {
      return;
    }
    const today = new Date();
    if (today > this.endDate) {
      this.status = 'finished';
      await getDb().contractRepository.save(this);
    }
  }
}

export default Contract;

export const createContractSchema = object({
  startDate: string().required(),
  endDate: string().required(),
  status: string().required(),
  price: number().required(),
  washingMachine: object().required(),
});

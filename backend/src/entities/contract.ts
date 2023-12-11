import { AfterLoad, BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { date, object, string } from 'yup';
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

  @BeforeInsert()
  setName(): void {
    this.name = `Contract between ${this.user.name} and ${
      this.washingMachine.name
    } from ${this.startDate.toISOString()} to ${this.endDate.toISOString()} for ${this.price}€`;
  }

  @AfterLoad()
  async updateStatus(): Promise<void> {
    if (this.status !== 'ongoing') {
      return;
    }
    const today = new Date();
    if (today > this.endDate) {
      this.status = 'finished';
      await getDb().contractRepository.update(this.id, { status: 'finished' });
    }
  }
}

export default Contract;

export const createContractSchema = object({
  startDate: date().required(),
  endDate: date().required(),
  washingMachine: string().required(),
});

export const updateContractSchema = object({
  status: string().required(),
}).test('is-cancelled', 'Contract can only be cancelled', (value) => value.status === 'cancelled');

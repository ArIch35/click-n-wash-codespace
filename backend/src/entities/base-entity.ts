import { BeforeUpdate, Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
abstract class BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string = v4();

  @Column()
  createdAt: string = new Date().getTime().toString();

  @Column()
  updatedAt: string = new Date().getTime().toString();

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date().getTime().toString();
  }
}

export default BaseEntity;

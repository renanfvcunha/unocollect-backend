/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserReunion } from './UserReunion'
import { Field } from './Field'

@Entity({
  name: 'fields_users_reunions'
})
export class FieldUserReunion {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => UserReunion,
    user_reunion => user_reunion.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  user_reunion: UserReunion

  @ManyToOne(
    type => Field,
    field => field.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  field: Field

  @Column('text')
  value: string

  @Column()
  updates: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

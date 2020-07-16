/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User'
import { Field } from './Field'

@Entity({
  name: 'fields_values'
})
export class FieldValue {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => User,
    user => user.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  user: User

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

  @Column({
    default: 0
  })
  updates: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

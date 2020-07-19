/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Form } from './Form'
import { User } from './User'

@Entity({
  name: 'forms_status'
})
export class FormStatus {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => Form,
    form => form.status,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn({
    name: 'form_id'
  })
  form: number

  @ManyToOne(
    type => User,
    user => user.status,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn({
    name: 'user_id'
  })
  user: number

  @Column('smallint', {
    default: 0
  })
  status: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

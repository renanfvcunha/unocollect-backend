/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserForm } from './UserForm'
import { Field } from './Field'

@Entity({
  name: 'fields_users_values'
})
export class FieldUserValue {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => Field,
    field => field.fieldUserValue,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  field: Field

  @ManyToOne(
    type => UserForm,
    userForm => userForm.fieldUserValue,
    {
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
      nullable: false
    }
  )
  userForm: UserForm

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

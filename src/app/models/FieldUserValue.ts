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
  @JoinColumn({
    name: 'field_id'
  })
  field: number

  @ManyToOne(
    type => UserForm,
    userForm => userForm.fieldUserValue,
    {
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
      nullable: false
    }
  )
  @JoinColumn({
    name: 'user_form_id'
  })
  userForm: number

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

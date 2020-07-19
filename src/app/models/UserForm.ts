/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { User } from './User'
import { Form } from './Form'
import { ImageUserForm } from './ImageUserForm'
import { FieldUserValue } from './FieldUserValue'

@Entity({
  name: 'users_forms'
})
export class UserForm {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => User,
    user => user.userForm,
    {
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
      nullable: false
    }
  )
  @JoinColumn({
    name: 'user_id'
  })
  user: number

  @ManyToOne(
    type => Form,
    form => form.userForm,
    {
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
      nullable: false
    }
  )
  @JoinColumn({
    name: 'form_id'
  })
  form: number

  @Column('decimal')
  latitude: number

  @Column('decimal')
  longitude: number

  @CreateDateColumn()
  created_at: number

  @UpdateDateColumn()
  updated_at: number

  @OneToMany(
    type => ImageUserForm,
    imageUserForm => imageUserForm.userForm
  )
  imageUserForm: ImageUserForm[]

  @OneToMany(
    type => FieldUserValue,
    fieldUserValue => fieldUserValue.userForm
  )
  fieldUserValue: FieldUserValue[]
}

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
  id?: number

  @ManyToOne(
    type => User,
    user => user.userForm,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn({
    name: 'user_id'
  })
  user?: User

  @ManyToOne(
    type => Form,
    form => form.userForm,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn({
    name: 'form_id'
  })
  form?: Form

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude?: number

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude?: number

  @CreateDateColumn()
  created_at?: string

  @UpdateDateColumn()
  updated_at?: string

  @OneToMany(
    type => ImageUserForm,
    imageUserForm => imageUserForm.userForm,
    { cascade: ['insert'] }
  )
  imageUserForm?: ImageUserForm[]

  @OneToMany(
    type => FieldUserValue,
    fieldUserValue => fieldUserValue.userForm,
    { cascade: ['insert'] }
  )
  fieldUserValue?: FieldUserValue[]
}

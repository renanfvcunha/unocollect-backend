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

@Entity({
  name: 'images_users_forms'
})
export class ImageUserForm {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => UserForm,
    userForm => userForm.imageUserForm,
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

  @Column({
    length: 30
  })
  name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

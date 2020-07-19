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
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  userForm: UserForm

  @Column({
    length: 25
  })
  name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

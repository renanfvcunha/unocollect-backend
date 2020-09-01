/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { UserForm } from './UserForm'

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100
  })
  name: string

  @Column({
    length: 50
  })
  username: string

  @Column({
    length: 100
  })
  password: string

  @Column({
    default: false
  })
  admin: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(
    type => UserForm,
    userForm => userForm.form
  )
  userForm: UserForm[]
}

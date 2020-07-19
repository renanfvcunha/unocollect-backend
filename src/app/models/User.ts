/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { FormStatus } from './FormStatus'
import { UserForm } from './UserForm'

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  registration: number

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
    type => FormStatus,
    status => status.user
  )
  status: FormStatus[]

  @OneToMany(
    type => UserForm,
    userForm => userForm.form
  )
  userForm: UserForm[]
}

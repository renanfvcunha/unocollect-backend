/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { Group } from './Group'
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

  @ManyToMany(
    type => Group,
    group => group.users,
    {
      cascade: true
    }
  )
  @JoinTable({
    name: 'users_groups',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'group_id',
      referencedColumnName: 'id'
    }
  })
  groups: Group[]
}

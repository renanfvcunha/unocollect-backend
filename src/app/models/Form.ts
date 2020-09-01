/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { Category } from './Category'
import { Field } from './Field'
import { UserForm } from './UserForm'

@Entity({
  name: 'forms'
})
export class Form {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => Category,
    category => category.form,
    {
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  )
  @JoinColumn({
    name: 'category_id'
  })
  category: number

  @Column({
    length: 100
  })
  title: string

  @Column('text')
  description: string

  @Column('smallint', {
    default: 1
  })
  status: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(
    type => Field,
    field => field.form
  )
  fields: Field[]

  @OneToMany(
    type => UserForm,
    userForm => userForm.form
  )
  userForm: UserForm[]
}

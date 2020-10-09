/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { Category } from './Category'
import { Field } from './Field'
import { Group } from './Group'
import { UserForm } from './UserForm'

@Entity({
  name: 'forms'
})
export class Form {
  @PrimaryGeneratedColumn()
  id?: number

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
  category?: Category

  @Column({
    length: 100
  })
  title?: string

  @Column('text')
  description?: string

  @Column('smallint', {
    default: 1
  })
  status?: number

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date

  @OneToMany(
    type => Field,
    field => field.form,
    { cascade: ['insert'] }
  )
  fields?: Field[]

  @OneToMany(
    type => UserForm,
    userForm => userForm.form
  )
  userForm?: UserForm[]

  @ManyToMany(
    type => Group,
    group => group.forms,
    {
      cascade: true
    }
  )
  @JoinTable({
    name: 'forms_groups',
    joinColumn: {
      name: 'form_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'group_id',
      referencedColumnName: 'id'
    }
  })
  groups?: Group[]
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Form } from './Form'
import { FieldUserValue } from './FieldUserValue'

@Entity({
  name: 'fields'
})
export class Field {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => Form,
    form => form.fields,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  form: Form

  @Column({
    length: 100
  })
  name: string

  @Column({
    length: 200,
    nullable: true
  })
  description: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(
    type => FieldUserValue,
    fieldUserValue => fieldUserValue.field
  )
  fieldUserValue: FieldUserValue[]
}

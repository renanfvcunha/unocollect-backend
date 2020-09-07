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
  @JoinColumn({
    name: 'form_id'
  })
  form: number

  @Column({
    length: 100
  })
  name: string

  @Column({
    length: 200,
    nullable: true
  })
  description: string

  @Column({
    length: 20,
    default: 'text'
  })
  type: string

  @Column({
    length: 200,
    nullable: true
  })
  options: string

  @Column({
    default: false
  })
  required: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(
    type => FieldUserValue,
    fieldUserValue => fieldUserValue.field
  )
  fieldsUserValue: FieldUserValue[]
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Form } from './Form'

@Entity({
  name: 'categories'
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 50
  })
  name: string

  @OneToMany(
    type => Form,
    form => form.category
  )
  form: Form[]
}

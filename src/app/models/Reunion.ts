/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Category } from './Category'
import { Field } from './Field'

@Entity({
  name: 'reunions'
})
export class Reunion {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => Category,
    category => category.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  )
  category: Category

  @Column({
    length: 100
  })
  title: string

  @Column('text')
  description: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(
    type => Field,
    field => field.reunion
  )
  fields: Field[]
}

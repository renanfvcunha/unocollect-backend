/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Reunion } from './Reunion'

@Entity({
  name: 'fields'
})
export class Field {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => Reunion,
    reunion => reunion.fields,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  reunion: Reunion

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
}

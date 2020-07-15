/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User'
import { Reunion } from './Reunion'

@Entity({
  name: 'users_reunions'
})
export class UserReunion {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => User,
    user => user.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
      nullable: false
    }
  )
  user: User

  @ManyToOne(
    type => Reunion,
    reunion => reunion.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
      nullable: false
    }
  )
  reunion: Reunion

  @Column('decimal')
  latitude: number

  @Column('decimal')
  longitude: number

  @Column('smallint')
  status: number

  @CreateDateColumn()
  created_at: number

  @UpdateDateColumn()
  updated_at: number
}

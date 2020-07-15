/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserReunion } from './UserReunion'

@Entity({
  name: 'images_users_reunions'
})
export class ImageUserReunion {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    type => UserReunion,
    user_reunion => user_reunion.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false
    }
  )
  user_reunion: UserReunion

  @Column({
    length: 25
  })
  name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

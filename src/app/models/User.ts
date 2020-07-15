import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  registration: number

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
}

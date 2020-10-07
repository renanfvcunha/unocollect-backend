import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Form } from './Form'
import { User } from './User'

@Entity({
  name: 'groups'
})
export class Group {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 50
  })
  name?: string

  @ManyToMany(
    type => Form,
    form => form.groups
  )
  forms?: Form[]

  @ManyToMany(
    type => User,
    user => user.groups
  )
  users?: User[]
}

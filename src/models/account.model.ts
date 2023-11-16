import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn
} from "typeorm";

import { History } from './history.model'
import { Favorite } from './favorite.model'

@Entity('account')
export class Account extends BaseEntity {
    @PrimaryGeneratedColumn({name:'uid'})
    uid: number

    @Column({name:'username'})
    username: string

    @Column({name:'password', type: 'text'})
    password: string

    @Column({name:'email'})
    email: string

    @Column({name:'joined_date'})
    joinedDate: Date

    @Column({name:'expired_date', nullable: true})
    expiredDate: Date

    @Column({name:'is_admin'})
    isAdmin: boolean

    @Column({name:'profile_pic_directory', nullable: true})
    profilePicDirectory: string

    @OneToMany(() => History, history => history.account, {cascade: true})
    @JoinColumn({name:'uid'})
    histories: History[]

    @OneToMany(() => Favorite, favorite => favorite.account, {cascade: true})
    @JoinColumn({name:'uid'})
    favorites: Favorite[]
}
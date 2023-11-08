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
import { FaceID } from "./faceid.model";

@Entity('account')
export class Account {
    @PrimaryGeneratedColumn({name:'uid'})
    uid: number

    @Column({name:'username'})
    username: string

    @Column({name:'password'})
    password: string

    @Column({name:'email'})
    email: string

    @Column({name:'joined_date'})
    joinedDate: Date

    @Column({name:'is_admin'})
    isAdmin: boolean

    @OneToOne(type => FaceID)
    @JoinColumn({name:'uid'})
    faceId: FaceID

    @OneToMany(type => History, history => history.account)
    @JoinColumn({name:'uid'})
    histories: History[]

    @OneToMany(type => Favorite, favorite => favorite.account)
    @JoinColumn({name:'uid'})
    favorites: Favorite[]
}
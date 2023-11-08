import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { Duration } from 'ts-duration'

import { Account } from './account.model'
import { Chapter } from './chapter.model'

@Entity()
export class History extends BaseEntity {
    @PrimaryGeneratedColumn({name:'history_id'})
    historyId: number

    @ManyToOne(type => Chapter)
    @JoinColumn({name:'chapter_id'})
    chapter: Chapter

    @Column({name: 'curr_duration'})
    currDuration: Duration

    @ManyToOne(type => Account)
    @JoinColumn({name:'uid'})
    account: Account
}
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    ManyToOne,
    JoinColumn,
    JoinTable
} from 'typeorm'

import { Account } from './account.model'
import { Book } from './book.model'

@Entity('favorite')
export class Favorite extends BaseEntity {
    @PrimaryGeneratedColumn({name:'favorite_id'})
    favoriteId: number

    @ManyToMany(() => Book)
    @JoinTable({
        name: 'favorite_book',
        joinColumn: {
            name: 'favorite_id',
            referencedColumnName: 'favoriteId'
        },
        inverseJoinColumn: {
            name: 'book_id',
            referencedColumnName: 'bookId'
        }
    })
    books: Book[]

    @ManyToOne(() => Account)
    @JoinColumn({name:'uid'})
    account: Account
}
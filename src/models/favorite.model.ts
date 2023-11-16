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

    @ManyToMany(() => Book, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
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

    @ManyToOne(() => Account, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name:'uid'})
    account: Account
}
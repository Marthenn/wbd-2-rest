import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn, ManyToOne, JoinColumn
} from "typeorm";
import {Book} from "./book.model";

@Entity()
export class Chapter extends BaseEntity { // no book_id since it's joined there (book is collection of chapters)
    @PrimaryGeneratedColumn({name:'chapter_id'})
    chapterId: number

    @Column({name:'chapter_name'})
    chapterName: string

    @Column({name:'transcript', nullable: true})
    transcript: string

    @Column({name:'audio_directory'})
    audioDirectory: string
    
    @ManyToOne(() => Book, book => book.chapters, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name:'book_id'})
    book: Book
}
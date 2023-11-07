import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Chapter extends BaseEntity { // no book_id since it's joined there (book is collection of chapters)
    @PrimaryGeneratedColumn({name:'chapter_id'})
    chapterId: number

    @Column()
    chapter: number

    @Column({name:'transcript_directory', nullable: true})
    transcriptDirectory: string

    @Column({name:'audio_directory'})
    audioDirectory: string
}
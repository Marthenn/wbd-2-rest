import {
    Entity,
    Column
} from "typeorm";

@Entity()
export class FaceID{
    @Column({name:'facial_id'})
    facialId: string
}
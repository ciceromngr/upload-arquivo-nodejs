import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('uploading')
class Uploading {

    @PrimaryColumn({
        generated: "increment",
        type: 'integer'
    })
    readonly id: number

    @Column()
    name: string

    @Column()
    size: number

    @Column()
    key: string

    @Column()
    url: string

    @CreateDateColumn()
    createdAt: Date

}

export { Uploading }
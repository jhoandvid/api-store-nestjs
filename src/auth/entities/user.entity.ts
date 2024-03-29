import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {unique:true})
    email:string;

    @Column('text', {select:true})
    password:string;

    @Column('text')
    fullname:string;

    @Column('boolean', {default:true})
    isActive:boolean;

    @Column('text', {array:true, default:['user']})
    roles:string[];


    @BeforeInsert()
    checkFiledsBeforeInsert(){
        this.email=this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFiledsBeforeUpdate(){
        this.checkFiledsBeforeInsert();
    }

}

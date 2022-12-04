import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../product/entities/product.entity';

@Entity({name:"suppliers"})
export class Supplier {

    @PrimaryGeneratedColumn('uuid')
    supplierId:string;

    @Column('text')
    companyName:string;
    
    @Column('text', {unique:true})
    contactName:string;

    @Column('text', {unique:true})
    adress:string;

    @Column('int', {unique:true})
    phone:number;

    @Column('text')
    country:string;

    @Column('bool', {default:true})
    isActive:boolean;

    @OneToMany(()=>Product,(product=>product.supplier),{cascade:true})
    product:Product[]



}

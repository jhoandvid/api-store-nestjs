import { AfterUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';

@Entity({name:'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    productId:string;

    @Column('text', {
        unique:true
    })
    productName:string;

    @Column('text', {
        default:null
    })
    description:string;

    @Column('decimal',{precision:10, scale:2, default: 0})
    price:number;

    @Column('int')
    amount:number

    @Column('bool', {default:true})
    isActive:boolean;

    @Column('text',{
        array:true,
        default:[]
    })
    picture:string[]

    @ManyToOne(()=>Category,(category)=>category.product,{onDelete:'CASCADE'})
    category:Category;

    @ManyToOne(()=>Supplier, (supplier)=>supplier.product)
    supplier:Supplier;


   @OneToMany(()=>OrderDetail, (orderDetail)=>orderDetail.product)
    orderDetail:OrderDetail[];



}

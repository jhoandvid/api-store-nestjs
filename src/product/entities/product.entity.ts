import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from '../../categories/entities/category.entity';

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

    @Column('float')
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

    @ManyToOne(()=>Category,(category)=>category.product)
    category:Category;

}

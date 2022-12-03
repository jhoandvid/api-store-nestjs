

import { Product } from "src/product/entities/product.entity";
import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { CategoryImage } from './category-img.entity';


@Entity({name:'categories'})
export class Category {

    @PrimaryGeneratedColumn('uuid')
    categoryId:string;

    @Column('text',{
        unique:true,
    })
    categoryName:string;

    @Column('text')
    description:string;

    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @OneToMany(
        ()=>CategoryImage,
        (categoryImg)=>categoryImg.category,
        {cascade:true, eager:true}
    )
    images?:CategoryImage[];



    @OneToMany(()=>Product,(product)=>product.category,{cascade:true})
    product:Product[];


}

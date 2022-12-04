import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity({name:'categories_images'})
export class CategoryImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @ManyToOne(
        ()=>Category,
        (category)=> category.images,
        {onDelete:'CASCADE'})
    category:Category;


}
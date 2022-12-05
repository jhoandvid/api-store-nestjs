import { IsArray, IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { Category } from '../../categories/entities/category.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

export class CreateProductDto {
    
    @IsString()
    productName:string;

    @IsString()
    description:string;

    @IsInt()
    @Min(0)
    price:number;

    @IsInt()
    @Min(0)
    amount:number;

    @IsOptional()
    @IsArray()
    picture:string[];

    @IsUUID()
    category:Category;

    @IsUUID()
    supplier:Supplier;

}

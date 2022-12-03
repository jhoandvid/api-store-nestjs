import {IsArray, IsOptional, IsString, MinLength} from 'class-validator'
import { isArray } from 'util';
import { CategoryImage } from '../entities/category-img.entity';

export class CreateCategoryDto {

    @IsString()
    @MinLength(3)
    categoryName:string;

    @IsString()
    @MinLength(3)
    description:string;

    @IsOptional()
    @IsString({each:true})
    @IsArray()    
    images?:string[];

    

}

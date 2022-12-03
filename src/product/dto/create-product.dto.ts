import { IsArray, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
    
    @IsString()
    @IsOptional()
    productName:string;

    @IsOptional()
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

    




}

import { IsIn, IsInt, IsString, IsUUID, Min, MinLength } from "class-validator";
import { Product } from '../../product/entities/product.entity';

export class CreateSupplierDto {

    @IsString()
    companyName:string

    @IsString()
    contactName:string;

    @IsString()
    adress:string;

    @IsInt()
    @Min(8)
    phone:number;

    @IsString()
    country:string;


    @IsUUID()
    product:Product[];


}

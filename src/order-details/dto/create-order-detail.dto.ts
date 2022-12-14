import { isDecimal, isIn, min, IsInt, IsDecimal, Min, IsUUID, IsOptional, Max } from 'class-validator';
import { Product } from '../../product/entities/product.entity';

export class CreateOrderDetailDto {


    @Min(1)
    quantity:number;

    @IsOptional()
    @Min(1, {message:'discount must not be less than 1%'})
    @Max(90, {message:"discount must not be greater than 90%"})
    discount:number;

    @IsUUID()
    product:Product;    

}

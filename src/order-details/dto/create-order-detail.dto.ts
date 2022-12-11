import { isDecimal, isIn, min, IsInt, IsDecimal, Min, IsUUID, IsOptional } from 'class-validator';
import { Product } from '../../product/entities/product.entity';

export class CreateOrderDetailDto {



    @Min(0)
    unitPrice:number;

    @Min(1)
    quantity:number;

    @IsOptional()
    discount:number;

    @IsUUID()
    product:Product;    

}

import { IsString, MinLength } from 'class-validator';

export class CreateOrderDto {

    @IsString()
    @MinLength(6)
    shipName:string;

    @IsString()
    @MinLength(6)
    shipAddress:string;


}

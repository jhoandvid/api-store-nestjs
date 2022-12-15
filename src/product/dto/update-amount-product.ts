import { IsOptional, Min } from "class-validator";

export class UpdateAmountProduct{

    @Min(1)
    amount:number;

    @IsOptional()
    @Min(1)
    price:number;

}
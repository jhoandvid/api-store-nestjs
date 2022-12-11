import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderDetailsService {
  
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetail:Repository<OrderDetail>,
    private readonly productService:ProductService
    ){

  }
  
  async create(createOrderDetailDto: CreateOrderDetailDto) {

    const {product, ...otherOrderDetail}=createOrderDetailDto;

    const existProduct=await this.productService.findOne(String(product));

    existProduct.amount=existProduct.amount-otherOrderDetail.quantity;
  
    if(existProduct.amount<0){
        throw new NotFoundException(`there is not the amount specified in the record`)
    }

    this.productService.update(String(product), {...existProduct})

    const productCreate=this.orderDetail.create(createOrderDetailDto);
    await this.orderDetail.save(productCreate);

    return productCreate;
  }

  findAll() {
    return `This action returns all orderDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDetail`;
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return `This action updates a #${id} orderDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDetail`;
  }
}

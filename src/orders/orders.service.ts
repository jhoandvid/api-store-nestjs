import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {


  constructor(
    @InjectRepository(Order)
    private readonly orderRepository:Repository<Order>,
  ){

  }

  async create(createOrderDto: CreateOrderDto) {
    
    let fecha = new Date()
    fecha.setDate(fecha.getDate() + 7)
    const order=this.orderRepository.create({...createOrderDto, shippedDate:fecha});
    await this.orderRepository.save(order);
    return order;

  }

  async findAll() {
    return  this.orderRepository.find();
  }

  async findOne(uuid: string) {

  const order=await this.orderRepository.findOne({where:{costumerId:uuid}});

    if(!order){
    throw new BadRequestException(`Order id with ${uuid} no found`);
    }
    
    return order;
  }

 
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { ProductService } from '../product/product.service';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderDetailsService {
  
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository:Repository<OrderDetail>,
    private readonly dataSource:DataSource,

    private readonly productService:ProductService
    ){

  }

 

  async validationExistAmounProduct(existProduct:Product, productAvailable:number) {
  
    if(existProduct.amount<0){
       throw new NotFoundException(`The specified quantity is not in stock, only ${productAvailable}  ${existProduct.productName} left`)
    }

    return;

  }

  async updateAmountProduct(product:string, otherOrderDetail:any){
    const existProduct=await this.productService.findOne(product);

    const productAvailable=existProduct.amount;

    
    existProduct.amount=productAvailable-otherOrderDetail.quantity;

    await this.validationExistAmounProduct(existProduct, productAvailable);

    this.productService.update(String(product), {...existProduct});

    const priceProduct=existProduct.price;

    return priceProduct;

  }

  
  async create(createOrderDetailDto: CreateOrderDetailDto) {

    const {product, ...otherOrderDetail}=createOrderDetailDto;

    //valid if exist a product
    await this.productService.findOne(String(product));
    
    const priceProduct=await this.updateAmountProduct(String(product), otherOrderDetail);

    const orderDetailCreate=this.orderDetailRepository.create(createOrderDetailDto);
    orderDetailCreate.unitPrice=priceProduct;
    await this.orderDetailRepository.save(orderDetailCreate);

    return orderDetailCreate;
  }

  async findAll() {

   const queryBuilder=this.orderDetailRepository.createQueryBuilder('orderDetail')
   const ordersDetails=await queryBuilder.leftJoinAndSelect('orderDetail.product', 'product').select(['orderDetail', 'product.productName']).getMany()
  
    return ordersDetails;
  }

  async findOne(uuid: string) {

      const orderDetail=await this.orderDetailRepository.findOne({relations:{product:true},select:{product:{productName:true, productId:true}}, where:{orderId:uuid}});

      if(!orderDetail){
        throw new NotFoundException(`OrderDetail with uuid ${uuid} not found`);
      }

      return orderDetail;


  }


  async update(uuid: string, updateOrderDetailDto: UpdateOrderDetailDto) {

     const queryRunner=this.dataSource.createQueryRunner();

      const orderDetail=await this.findOne(uuid);
      

      if(!orderDetail){
        throw new NotFoundException(`OrderDetail with uuid ${uuid} not found`);
      }

      const product:Product=orderDetail.product;

      if(String(updateOrderDetailDto.product)!==orderDetail.product.productId){
        throw new NotFoundException(`The product cannot be exchanged`);
      }

      const quantityUpdate=updateOrderDetailDto.quantity-orderDetail.quantity;
      orderDetail.unitPrice= await this.updateAmountProduct(product.productId,{ ...updateOrderDetailDto, quantity:quantityUpdate });
  
     const updateDetailsOrder= await this.orderDetailRepository.preload({ ...orderDetail, ...updateOrderDetailDto, })
      await queryRunner.manager.save(updateDetailsOrder);
      return this.findOne(uuid);
  }


}

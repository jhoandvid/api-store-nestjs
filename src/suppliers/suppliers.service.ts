import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ProductService } from '../product/product.service';



@Injectable()
export class SuppliersService {


  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository:Repository<Supplier>,
  
    @Inject(forwardRef(() => ProductService))
    private readonly productService:ProductService

    ){

  }

  async create(createSupplierDto: CreateSupplierDto) {
    
      const {product}=createSupplierDto;

      await this.productService.findAll()


      const supplier=this.supplierRepository.create({...createSupplierDto, product});

      await this.supplierRepository.save(supplier);
    


    return {...supplier, product};
  }

  async findAll() {

    const supplier=await this.supplierRepository.find({
      where:{isActive:true, product:{isActive:true}}
    })

    return supplier;
  }

  async findOne(term: string) {

    let supplier:Supplier;


    const queryBuilder=this.supplierRepository.createQueryBuilder('supplier');

    
    /* supplier=await this.supplierRepository.findOne({
      relations:{product:{isActive:true}},
      where:{ supplierId:term, isActive:true}
    }) */
   

   if(isUUID(term)){

      supplier=await queryBuilder.leftJoinAndSelect('supplier.product', 'product', 'product.isActive =:active',{active:true})
      .where('supplier.supplierId=:term',{term}).andWhere('supplier.isActive=:active', {active:true}).getOne();

    }else{
     supplier=await queryBuilder.leftJoinAndSelect('supplier.product', 'product', 'product.isActive =:active',{active:true})
     .where('supplier.contactName=:term', {term}).andWhere('supplier.isActive=:active', {active:true}).getOne();
    } 


    if(!supplier){
      throw new BadRequestException(`Supplier with term ${term } no found`);
    }
  
    return supplier;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}

import { Injectable, BadRequestException, forwardRef, Inject, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ProductService } from '../product/product.service';



@Injectable()
export class SuppliersService {

  private readonly logger=new Logger('Supplier');


  constructor(


    @InjectRepository(Supplier)
    private readonly supplierRepository:Repository<Supplier>,
  
    @Inject(forwardRef(() => ProductService))
    private readonly productService:ProductService

    ){

  }

  async create(createSupplierDto: CreateSupplierDto) {
    
      const {product}=createSupplierDto;

      await this.productService.findOne(String(product))
      const supplier=this.supplierRepository.create({...createSupplierDto, product});

    try {
    
      await this.supplierRepository.save(supplier);
      return {...supplier, product};
      
    } catch (error) {
        this.handlerExeption(error);
    }
     
  
  }

  async findAll() {

    const queryBuilder=this.supplierRepository.createQueryBuilder('supplier');

    const supplier=await queryBuilder.leftJoinAndSelect('supplier.product','product', 'product.isActive=:active',{active:true})
    .select(['supplier', 'product.productName'])
    .getMany();



    return supplier;
  }

  async findOne(term: string) {

    let supplier:Supplier;


    const queryBuilder=this.supplierRepository.createQueryBuilder('supplier');

    

   if(isUUID(term)){

      supplier=await queryBuilder.leftJoinAndSelect('supplier.product', 'product', 'product.isActive =:active',{active:true})
      .select(['supplier', 'product.productName'])
      .where('supplier.supplierId=:term',{term}).andWhere('supplier.isActive=:active', {active:true}).getOne();

    }else{
     supplier=await queryBuilder.leftJoinAndSelect('supplier.product', 'product', 'product.isActive =:active',{active:true})
     .select(['supplier', 'product.productName'])
     .where('supplier.contactName=:term', {term})
     .andWhere('supplier.isActive=:active', {active:true}).getOne();
    } 


    if(!supplier){
      throw new BadRequestException(`Supplier with term ${term } no found`);
    }
  
    return supplier;
  }

  async update(uuid: string, updateSupplierDto: UpdateSupplierDto) {

  const queryBuilder=this.supplierRepository.createQueryBuilder('supplier');
   const supplier=await queryBuilder.where('supplier.supplierId=:uuid',{uuid}).getOne(); 

    if(!supplier){
      throw new BadRequestException(`Supplier with id ${uuid} no found`);
    }

    try{
      await this.supplierRepository.update(uuid,{...updateSupplierDto, isActive:true});
      return { ...supplier,...updateSupplierDto, isActive:true};

    }catch(error){
        this.handlerExeption(error)
    }
  }

  async remove(uuid: string) {
    
    const supplier=await this.findOne(uuid);

    if(!supplier){
      throw new NotFoundException(`Supplier with id ${uuid} no found`);
    }

    this.supplierRepository.update(uuid, {isActive:false});
    return;
  }


  private handlerExeption(error:any){
    if(error.code=="23505"){
      throw new BadRequestException(error.detail);
    }
    console.log(error);

    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check server logs`);

  }

}



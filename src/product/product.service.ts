import { Injectable, BadRequestException, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductService {

  private readonly logger=new Logger(`Product`);

  constructor
    (

      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,

      private readonly categoryService:CategoriesService
    
      ) {

  }

  async create(createProductDto: CreateProductDto) {

    const {productName, category}=createProductDto;

    const product=await this.productRepository.findOne({where:{isActive:false}});


    await this.categoryService.findOne(String(category));

    if(product){
        await this.productRepository.update({productName}, {...createProductDto, isActive:true});
        return {...product, ...createProductDto, isActive:true}

    }


    try {
      const product=this.productRepository.create({...createProductDto});
      await this.productRepository.save(product);
      return {...product};
    } catch (error) {
      this.handlerExeption(error);
    } 
  }

  async findAll() {
    const product = await this.productRepository.find({
      relations: { category: true }, select: {
        category: { categoryName: true, description: true, images: { url: false } },
      },
      where:{category:{isActive:true}}
    });

    return product
  }

  async findOne(term: string) {

    let product:Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        relations: { category: true },
        select: { category: { categoryName: true } },
        where: { productId: term, isActive:true, category:{isActive:true}},

      });
    } else {
      product = await this.productRepository.findOne({
        relations: { category: true },
        select: { category: { categoryName: true } },
        where: { productName: term, isActive:true }
      });

    }

    if (!product) {
      throw new BadRequestException(`Product with term ${term} no found`);
    }

    return product;
  }

  async findOneProducActivate(uuid:string){
      const product = await this.productRepository.findOne({
        where:{productId:uuid}
      })
      if(!product){
        throw new NotFoundException(`product with id ${uuid} no found`);
      }
      return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product:Product=await this.findOne(id);

    await this.productRepository.update({productId:product.productId},{...updateProductDto});
   
    return {...product, ...updateProductDto}
  }

  async remove(id: string) {

    const {productId}=await this.findOne(id);
    await this.productRepository.update({productId},{isActive:false});


  }

  private handlerExeption(error:any){
 
    if(error.code==="23505"){
        throw new BadRequestException(error.detail);
    }
    console.log(error);
    this.logger.error(error)
    throw new InternalServerErrorException(`Unexpected error, check server logs`);
  }

  
}
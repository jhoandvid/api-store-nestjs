import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductService {

  constructor
    (
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>
    ) {

  }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
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

    let product;

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
}

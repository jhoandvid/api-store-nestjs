import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryImage } from './entities/category-img.entity';

import {validate as isUUID} from 'uuid';


@Injectable()
export class CategoriesService {

  private readonly logger=new Logger(`categories`)

  constructor(

    @InjectRepository(Category)
    private readonly categoryRepository:Repository<Category>,
    
    @InjectRepository(CategoryImage)
    private readonly categoryImageRepository:Repository<CategoryImage>,

    private readonly dataSource:DataSource
    ){

  }

  async create(createCategoryDto: CreateCategoryDto) {
    
    const {images=[],...categoryDetails}=createCategoryDto

    try {

      const category=await this.categoryRepository.findOneBy({
        categoryName:categoryDetails.categoryName,
        isActive:false
      }); 

      if(!category){
        const catogory=this.categoryRepository.create({
          ...categoryDetails,  
          images: images.map(image=>this.categoryImageRepository.create({url:image})), 
        });
  
        await this.categoryRepository.save(catogory);
  
        return {...catogory, images, ...categoryDetails};
      
      }
      const querryRunner=this.dataSource.createQueryRunner();
      const categoryNew=await this.categoryRepository.preload({categoryId:category.categoryId,...categoryDetails, isActive:true}) 

      if(images){
          querryRunner.manager.delete(CategoryImage, {category:category.categoryId});
          categoryNew.images=images.map(img=>this.categoryImageRepository.create({url:img}));
        }

        console.log(categoryNew.images);
        
        querryRunner.manager.save(categoryNew);
        return {...categoryNew, images}


    } catch (error) {
      this.handlerExeption(error);
    }

  }

 async findAll() {

    const categories=await this.categoryRepository.find({
      where:{isActive:true}
    });
    return categories.map(category=>({
      ...category,
      images: category.images.map(img=>img.url)
    })); 
   

  }

  async findOne(uuid: string) {

  

    let category:Category;
   
          if(isUUID(uuid)){
            category=await this.categoryRepository.findOneBy({
            categoryId:uuid, 
            isActive:true,
          })


        }else{
          const queryBuilder=this.categoryRepository.createQueryBuilder('categ');
          category=await queryBuilder.where(`UPPER(categ.categoryName)=:categoryName`,{
              categoryName:uuid.toUpperCase()
          }, ).andWhere('categ.isActive=:isActive',{
              isActive:true
          }).leftJoinAndSelect('categ.images','images').getOne();

        }

        if(!category){
          throw new NotFoundException(`Category with id ${uuid} no found`);
        }
        
        return {...category, images:category.images.map(img=>img.url)};   
  }


 async update(uuid: string, updateCategoryDto: UpdateCategoryDto) {
    
      const {images, ...dataCategory}=updateCategoryDto;


      const categoryData=await this.findOne(uuid);

      if(!categoryData){
        throw new BadRequestException(`Category with id ${uuid} no found`)
      }

      const category=await this.categoryRepository.preload({categoryId:uuid, ...dataCategory});
      
      if(images){
        
        const queryRunnir= this.dataSource.createQueryRunner();
        await queryRunnir.manager.delete(CategoryImage, {category:uuid});

        category.images=images.map(img=>this.categoryImageRepository.create({url:img}));
        queryRunnir.manager.save(category);
      }


  }





  async remove(id: string) {

    const category=await this.findOne(id);

    if(!category){
      throw new NotFoundException(`Category with id ${id} no found`);
    }

    try {
     await this.categoryRepository.update(id, {isActive:false})
      
    } catch (error) {
      this.handlerExeption(error);
    }

   
   //const queryBuilder= this.categoryRepository.createQueryBuilder('category');
   //const categoryBuilder=queryBuilder
  
 
    
  

  

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

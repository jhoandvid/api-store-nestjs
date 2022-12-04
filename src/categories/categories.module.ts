import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';

import{TypeOrmModule} from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { CategoryImage } from './entities/category-img.entity';

@Module({
  controllers: [CategoriesController],
  exports:[CategoriesService],
  imports:[TypeOrmModule.forFeature([Category, CategoryImage])],
  providers: [CategoriesService]
})
export class CategoriesModule {}

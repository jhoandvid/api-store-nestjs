import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports:[TypeOrmModule.forFeature([Product]), CategoriesModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}

import { Module} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Product]), CategoriesModule, SuppliersModule,  AuthModule],
  exports:[ProductService],
  controllers: [ProductController],
  providers: [ProductService],
  
})
export class ProductModule {}

import { forwardRef, Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { ProductModule } from 'src/product/product.module';


@Module({
  controllers: [SuppliersController],
  exports:[SuppliersService],
  imports:[TypeOrmModule.forFeature([Supplier]), forwardRef(()=>ProductModule)],
  providers: [SuppliersService]
})
export class SuppliersModule {}

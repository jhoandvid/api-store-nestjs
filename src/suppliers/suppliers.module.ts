import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';

@Module({
  controllers: [SuppliersController],
  imports:[TypeOrmModule.forFeature([Supplier])],
  providers: [SuppliersService]
})
export class SuppliersModule {}

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderDetailsModule } from 'src/order-details/order-details.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

@Module({
  controllers: [OrdersController],
  imports:[ TypeOrmModule.forFeature([Order]), OrderDetailsModule, OrderDetailsModule],
  providers: [OrdersService]
})
export class OrdersModule {}

import { Module, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { ProductModule } from './product/product.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({

  
  imports: [

  ConfigModule.forRoot(),
    
   TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize:true,       
    }),

    CategoriesModule,
    ProductModule,
    SuppliersModule,
    OrderDetailsModule,
    OrdersModule,
    AuthModule  
  ],

  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(private readonly configService:ConfigService){
  }
  
}

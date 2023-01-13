import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateAmountProduct } from './dto/update-amount-product';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interface/valid.role';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':uuid')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(uuid, updateProductDto);
  }

  @Patch('update-amount-product/:uuid')
  updateAmountProduct(@Param('uuid', ParseUUIDPipe) uuid:string, @Body() updateAmountProduct:UpdateAmountProduct){
    return this.productService.updateAmountProduct(uuid, updateAmountProduct);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}

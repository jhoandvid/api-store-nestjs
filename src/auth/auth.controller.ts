import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { RawHeader } from './decorators/get-rawHeader.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDTO } from './dto/login-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUser:LoginDTO){
      return this.authService.login(loginUser);
  }


  @Get('check-status')
  checkAuthStatus(
    @GetUser() user:User
  ){
    return this.authService.checkAuthStatus(user.id)
  }


  @Get('private')
 
  @UseGuards( AuthGuard())
  prueba(@GetUser()user:User, @RawHeader() rawHeaders:string[], @Headers() headers:IncomingHttpHeaders){
    return {
      hola:'buenas',
      rawHeaders,
      headers,
      user
    }
  }



}

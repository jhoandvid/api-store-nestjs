import { BadGatewayException, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login-user.dto';
import { JwtStrategy } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private logger=new Logger()
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private jwtService:JwtService

   

  ){

  }

  async create(createAuthDto: CreateAuthDto) {

    try {
      const {password,...userData}=createAuthDto;
    
    const user= this.userRepository.create({
      ...userData,
      password:bcrypt.hashSync(password, 10)
    })

      await this.userRepository.save(user);
      return {...user, token: this.getToken({uid:user.id})}; 

    } catch (error) {
        this.handleDBException(error);
    }
  }


  async login(loginUser:LoginDTO){

    const {password, email}=loginUser;


    const user=await this.userRepository.findOne({where:{email, isActive:true}, select:{id:true, email:true, password:true}});
    if(!user){
      throw new BadRequestException(`Credentials are not valid`);
    }
    if(!bcrypt.compareSync(password, user.password)){
      throw new BadRequestException(`Credentials are not valid`);
    }

    return {...user, token:this.getToken({uid:user.id})};
  }


  private getToken(payload:JwtStrategy){
      return this.jwtService.sign(payload);
  }

  

  async checkAuthStatus(id:string){

    const user=await this.userRepository.findOne({
      where:{id},
      select:{id:true, email:true, password:true, fullname:true, isActive:true}
    })

    return {...user, token:this.getToken({uid:user.id})}

  }



  handleDBException(error:any):never{

    if(error.code==="23505"){
      throw new BadGatewayException(`${error.detail}`)
    }

    console.log(error);
    
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check server logs`);
  }

}

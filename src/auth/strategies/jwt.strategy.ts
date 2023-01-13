import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "../entities/user.entity";
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, Injectable } from '@nestjs/common';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        configService:ConfigService
    ){
        super({
            secretOrKey:configService.get('JWT_SECRET'),
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }


    async validate(payload:any):Promise<User>{

        const {uid}=payload;
        const user=await this.userRepository.findOne({where:{id:uid}});

        if(!user){
            throw new UnauthorizedException('Token no valid');
        }

        if(!user.isActive){
            throw new UnauthorizedException('User is incative, talk with an admin');
        }

        return user;


    }


   
}




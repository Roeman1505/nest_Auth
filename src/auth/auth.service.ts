import { AuthDto } from './dto/auth.dto';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from './utils/constants';
import { Request,Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt:JwtService) { }

    async signup(dto: AuthDto) {
        const { email, password } = dto;
        const foundUser = await this.prisma.user.findUnique({ where: { email } })
        if (foundUser) {
            throw new BadRequestException('Email Already Exists')
        }
        const hashedPassword = await this.hashPassword(password);
        await this.prisma.user.create({
            data: {
                email,
                hashedPassword
            }
        })



        return { message: 'signup was successful' };


    }

    //==========SIGN IN FUNCTION========//
    async signin(dto:AuthDto,request:Request,response:Response ) {

const { email, password } = dto;

        const foundUser = await this.prisma.user.findUnique({ where: { email } })
        if (!foundUser) {
            throw new BadRequestException('Wrong Credentials');
        }

const isMatch = await this.comparePasswords({password,hash:foundUser.hashedPassword});

if(!isMatch){
 throw new BadRequestException('Wrong Credentials');
}


//========SIGN THE JWT TOKEN AND RETURN TO THE USER========

const token = await this.signToken({
     id:foundUser.id,
    email:foundUser.email,
    })

    if(!token){
        throw new ForbiddenException()
    }
response.cookie('token',token)

        return response.send({message:'Login successful'});
    }


    // =====-SIGN OUT FUNCTIONS====
    async signout(request:Request,response:Response) {
        response.clearCookie('token')



        return response.send({message:'Sign Out successfull'});
    }



    async hashPassword(password: string) {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
        
    }
async comparePasswords(args:{password:string , hash:string}){
    return await bcrypt.compare(args.password,args.hash);
}
async signToken(args:{id:string, email:string}){
    const payload =args 
    return this.jwt.signAsync(payload,{secret:jwtSecret})
}
}

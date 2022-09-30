import { PrismaService } from 'prisma/prisma.service';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

    async getMyUser(id:string,request:Request){
        const user = await this.prisma.user.findUnique({
            where: {id}});

          
            if(!user){
                throw new NotFoundException()
            }

        const decodedUser = request.user as { id: string, email: string };

        if(user.id !== decodedUser.id){
            throw new ForbiddenException();

        }
        delete user.hashedPassword;

return {user};
    }
    async getUsers(){
return await this.prisma.user.findMany(
    {
        select:{id:true,email:true}
    }
);
    }

}

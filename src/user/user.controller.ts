import { JwtAuthGuard } from './../auth/jwt.guard';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMyUser(@Param() params:{id:string},@Req() request){
    return this.userService.getMyUser(params.id,request);
  }

  @Get()
  getUsers(){
return this.userService.getUsers();
  }
}

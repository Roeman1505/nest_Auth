import { AuthDto } from './dto/auth.dto';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
@Post('signup')
signup(@Body() dto:AuthDto){
  return this.authService.signup(dto);
}





@Post('signin')
signin(@Body() dto:AuthDto, @Req() request ,@Res() response){
  return this.authService.signin(dto,request,response);
}



// =========SIGN OUT FUNCTION============
@Get('signout')
signout(@Req() request,@Res() response){
  return this.authService.signout(request,response);
}

}

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtSecret } from "./utils/constants";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
            
            ]),
            secretOrKey:jwtSecret
        });
    }
    private static extractJWT(request:Request):string| null {

        if(request.cookies && 'token' in request.cookies){
            return request.cookies.token;

        }
        return null;
    }
    async validate(payload:{ id:string,email:string}){
        return payload;
    }
}
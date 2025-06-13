import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, StrategyOptionsWithRequest, Strategy } from "passport-jwt";
import { Request } from "express";


interface JWTPayload {
    sub: number;
    email: string;
    [key: string]: any;
}

interface JwtPayloadwithRt extends JWTPayload {
    refreshToken: string;
}

@Injectable()
export class RfStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
    constructor(private readonly configService: ConfigService) {
        const options: StrategyOptionsWithRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        };
        super(options);
        console.log('RfStrategy constructor completed successfully!');
    }

    validate(req: Request, payload: JWTPayload):JwtPayloadwithRt {
        const authHeader = req.get('Authorization');
        if(!authHeader) {
            throw new Error('No refresh token provided.')
        }
        const refreshToken = authHeader.replace('Bearer', '').trim();
        if(!refreshToken) {
            throw new Error('Invalid refresh token format!');
        }
        return {
            ...payload, refreshToken
        };
    }
}
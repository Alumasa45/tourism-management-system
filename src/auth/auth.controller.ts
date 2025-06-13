import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth()                         
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Get('signout/:id')
  signOut( @Param('id', ParseIntPipe) id: number) {
    return this.authService.signOut(id);
  }

  @Get('refresh')
  refreshTokens(
    //@Query('id', ParseIntPipe) id: number,
    @Query('id') id: number,
    @Query('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(id, refreshToken);
  }

}

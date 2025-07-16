import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, VerifyCodeDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  sendCode(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.sendCode(createAuthDto);
  }

  @Post('verify-code')
  create(@Body() verifyCode: VerifyCodeDto, @Res({ passthrough: true }) res) {
    return this.authService.create(verifyCode, res);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req) {
    return this.authService.findAll(req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateAuthDto: UpdateAuthDto,
    @Req() req,
  ) {
    return this.authService.update(id, updateAuthDto, req);
  }

  @Post('refresh-token')
  generateToken(@Req() req) {
    return this.authService.generateToken(req);
  }
}

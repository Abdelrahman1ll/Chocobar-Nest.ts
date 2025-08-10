/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, VerifyCodeDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User, UserDocument } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as twilio from 'twilio';
import {
  TemporaryLogin,
  TemporaryLoginDocument,
} from './entities/Temporary-login.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TemporaryLogin.name)
    private temporaryLoginModel: Model<TemporaryLoginDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async sendCode(createAuthDto: CreateAuthDto) {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    // const accountSid = 'AC8809894adf7827b707bb55c06e2144ff';
    // const authToken = '61f8ee22b39e9d77975627a8f0c01e0c';
    // const client = twilio(accountSid, authToken);
    // try {
    //   const message = await client.messages.create({
    //     body: `مرحبا بك في نظامنا! هذا هو رمز التحقق الخاص بك: ${otp}`, // يمكنك تخصيص الرسالة هنا
    //     to: '+201065217980', // يفضل استخدام createAuthDto.phone هنا
    //     from: '+14405811629', // رقم Twilio المصرح لك بإرسال منه
    //   });

    //   console.log('Message SID successfully' + message.sid);
    // } catch (error) {
    //   console.error('Error sending message:', error);
    // }
    const user = await this.temporaryLoginModel.findOne({
      phone: createAuthDto.phone,
    });
    if (user) {
      await user?.deleteOne();
    }

    await this.temporaryLoginModel.create({
      name: createAuthDto.name,
      phone: createAuthDto.phone,
      otp,
      otpExpiration: new Date(Date.now() + 2 * 60 * 1000),
    });

    return {
      message: 'OTP sent successfully',
    };
  }

  async create(verifyCode: VerifyCodeDto, res: any) {
    const tokenVersion = Math.floor(10000 + Math.random() * 90000);
    const user = await this.temporaryLoginModel.findOne({
      phone: verifyCode.phone,
    });

    if (user) {
      const otpExpiration = user.get('otpExpiration');
      if (!otpExpiration) {
        throw new ConflictException('رمز التحقق منتهي الصلاحية');
      }
      const now = new Date();

      const diffInMs = now.getTime() - otpExpiration.getTime(); // فرق الوقت

      const diffInMinutes = diffInMs / (1000 * 60); // تحويله لدقايق

      if (diffInMinutes > 1) {
        await user?.deleteOne();
        throw new ConflictException('رمز التحقق منتهي الصلاحية');
      }
    }
    if (user?.otp !== verifyCode.otp) {
      await user?.deleteOne();
      throw new ConflictException('رمز التحقق غير صحيح');
    }

    let existingUser = await this.userModel.findOne({
      phone: verifyCode.phone,
    });

    if (!existingUser) {
      existingUser = await this.userModel.create({
        name: user?.name,
        phone: user?.phone,
        tokenVersion: tokenVersion,
      });
    } else {
      existingUser.name = user?.name;
      existingUser.phone = user?.phone;
      existingUser.tokenVersion = tokenVersion;
      await existingUser.save();
    }

    await this.temporaryLoginModel.deleteMany({});

    // أنشئ التوكن
    const accessToken = await this.jwtService.signAsync(
      {
        id: existingUser?._id,
        isAdmin: existingUser?.isAdmin,
        tokenVersion: tokenVersion,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: existingUser?._id,
        isAdmin: existingUser?.isAdmin,
        tokenVersion: tokenVersion,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '90d',
      },
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: false, // لازم false لو هتستخدم document.cookie
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false, // نفس الكلام
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 180,
    });

    return {
      success: 'success',
      existingUser,
      accessToken,
      refreshToken,
    };
  }

  async findAll(req) {
    if (req?.user?.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const users = await this.userModel.find({
      isAdmin: { $ne: true }, // يستبعد اللي isAdmin بتاعه true
    });
    return {
      number: users.length,
      success: true,
      users,
    };
  }

  async update(id: string, updateAuthDto: UpdateAuthDto, req) {
    if (req.user.id !== id) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateAuthDto },
      { new: true },
    );
    return {
      success: true,
      user,
    };
  }

  async generateToken(req) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('jwt expired');
    }

    // فك التوكن
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET, // لو عندك REFRESH_TOKEN_SECRET يكون أحسن
      });

      if (!payload) {
        throw new UnauthorizedException('jwt expired');
      }

      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('jwt expired');
      }
    } catch (error) {
      throw new UnauthorizedException('jwt expired');
    }

    // رجّع توكن جديد لمدة ساعة
    const accessToken = await this.jwtService.signAsync(
      {
        id: payload.id,
        isAdmin: payload.isAdmin,
        tokenVersion: payload.tokenVersion,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );

    return { accessToken };
  }
}

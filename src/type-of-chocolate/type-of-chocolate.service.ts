/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTypeOfChocolateDto } from './dto/create-type-of-chocolate.dto';
import { UpdateTypeOfChocolateDto } from './dto/update-type-of-chocolate.dto';
import {
  TypeOfChocolate,
  TypeOfChocolateDocument,
} from './entities/type-of-chocolate.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TypeOfChocolateService {
  constructor(
    @InjectModel(TypeOfChocolate.name)
    private typeOfChocolateModel: Model<TypeOfChocolateDocument>,
  ) {}
  async create(createTypeOfChocolateDto: CreateTypeOfChocolateDto, req: any) {
    if (req.user.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const Chocolate = new this.typeOfChocolateModel(createTypeOfChocolateDto);
    await Chocolate.save();
    return {
      status: 'success',
      Chocolate,
    };
  }

  async findAll() {
    const typeOfChocolates = await this.typeOfChocolateModel.find();
    return {
      status: 'success',
      typeOfChocolates,
    };
  }

  async update(
    id: string,
    updateTypeOfChocolateDto: UpdateTypeOfChocolateDto,
    req: any,
  ) {
    if (req.user.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const typeOfChocolate = await this.typeOfChocolateModel.findByIdAndUpdate(
      id,
      { $set: updateTypeOfChocolateDto },
      { new: true },
    );
    return {
      status: 'success',
      typeOfChocolate,
    };
  }
}

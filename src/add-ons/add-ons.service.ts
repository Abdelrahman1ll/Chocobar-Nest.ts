/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAddOnDto } from './dto/create-add-on.dto';
import { UpdateAddOnDto } from './dto/update-add-on.dto';
import { AddOn, AddOnDocument } from './entities/add-on.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AddOnsService {
  constructor(
    @InjectModel(AddOn.name) private addOnModel: Model<AddOnDocument>,
  ) {}
  async create(createAddOnDto: CreateAddOnDto, req) {
    if (req.user.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }

    const addOn = new this.addOnModel(createAddOnDto);
    await addOn.save();
    return {
      status: 'success',
      addOn,
    };
  }

  async findAll() {
    return this.addOnModel.find().exec();
  }

  async update(id: string, updateAddOnDto: UpdateAddOnDto, req) {
    if (req.user.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const addOn = await this.addOnModel.findByIdAndUpdate(
      id,
      { $set: updateAddOnDto },
      { new: true },
    );
    return {
      status: 'success',
      addOn,
    };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDeliveryPriceDto } from './dto/create-delivery-price.dto';
import {
  DeliveryPrice,
  DeliveryPriceDocument,
} from './entities/delivery-price.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class DeliveryPriceService {
  constructor(
    @InjectModel(DeliveryPrice.name)
    private deliveryPriceModel: Model<DeliveryPriceDocument>,
  ) {}
  async create(createDeliveryPriceDto: CreateDeliveryPriceDto, req) {
    if (req.user.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const existing = await this.deliveryPriceModel.findOne();

    if (existing) {
      const updated = await this.deliveryPriceModel.findByIdAndUpdate(
        existing._id,
        createDeliveryPriceDto,
        { new: true },
      );
      return {
        status: 'success',
        deliveryPrice: updated,
      };
    } else {
      const newDeliveryPrice = new this.deliveryPriceModel(
        createDeliveryPriceDto,
      );
      await newDeliveryPrice.save();
      return {
        status: 'success',
        deliveryPrice: newDeliveryPrice,
      };
    }
  }

  async findAll() {
    return this.deliveryPriceModel.find().exec();
  }
}

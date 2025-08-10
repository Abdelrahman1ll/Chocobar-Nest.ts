/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  DeliveryPrice,
  DeliveryPriceDocument,
} from 'src/delivery-price/entities/delivery-price.entity';
import { Basket, BasketDocument } from 'src/basket/entities/basket.entity';
@Injectable()
export class OrdersService {
  private readonly PAYMOB_API = 'https://accept.paymob.com/v1/intention/';
  private readonly SECRET_KEY =
    'egy_sk_test_56a7a0b1741e724b7949d11eca0959ff9eca25e0f56c4943c1fed08af2723e24';

  private readonly PAYMOB_API_KEY =
    'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T0RZeE9ERTFMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuOWZWQkt0ZWh0eE4yYjg4YWNkcFItYk5obmp5Q05uQ1M3VTZ6ZW1YOHNpQkRhTnE3b1pJQS15RmtNT1FfLW1tMEduWXZrQ2FoajAzLUc2YXo0MUlfSnc=';
  private readonly INTEGRATION_ID = 861815; // Card Integration ID من dashboard
  private readonly IFRAME_ID = 875124; // iframe ID من dashboard
  getOrders: any;

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(DeliveryPrice.name)
    private readonly deliveryPriceModel: Model<DeliveryPriceDocument>,
    @InjectModel(Basket.name)
    private readonly basketModel: Model<BasketDocument>,
    private readonly http: HttpService,
  ) {}
  async create(createOrderDto: CreateOrderDto, req) {
    const OrderNumber = Math.floor(1000 + Math.random() * 9000);

    if (req.user.isAdmin === true) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }

    const deliveryPrice = await this.deliveryPriceModel.findOne();

    if (!deliveryPrice) {
      throw new UnauthorizedException('Delivery price not found');
    }

    const basket = await this.basketModel
      .findOne({ user: req.user.id })
      .populate('Projects.Project')
      .populate('Projects.chocolates.chocolate')
      .populate('Projects.addOns.addOn');

    if (!basket || basket.Projects?.length === 0) {
      throw new UnauthorizedException('Basket not found');
    }

    const basketProjects = basket.Projects.map((p) => ({
      Project: p.Project,
      quantity: p.quantity,
      price: p.price,
      chocolates: p.chocolates.map((c) => ({
        chocolate: c.chocolate,
        price: c.price,
      })),
      addOns: p.addOns.map((a) => ({
        addOn: a.addOn,
        price: a.price,
      })),
    }));

    const totalPrice = basket.totalBasketPrice + deliveryPrice.DeliveryPrice;
    const order = await this.orderModel.create({
      basket: basketProjects,
      user: req?.user.id,
      address: createOrderDto.address,
      phone: createOrderDto.phone,
      name: createOrderDto.name,
      isPaid: createOrderDto.isPaid,
      totalPrice: totalPrice,
      orderNumber: OrderNumber,
      deliveryPrice: deliveryPrice.DeliveryPrice,
    });

    basket.Projects = [];
    basket.totalBasketPrice = 0;
    await basket.save();

    return {
      status: 'success',
      order,
    };
  }

  async createPaymob(createOrderDto: CreateOrderDto) {
    console.log(createOrderDto);
    // if (req.user.isAdmin === true) {
    //   throw new UnauthorizedException('You are not allowed on this router.');
    // }
    // const OrderNumber = Math.floor(1000 + Math.random() * 9000);
    // const deliveryPrice = await this.deliveryPriceModel.findOne();

    // if (!deliveryPrice) {
    //   throw new UnauthorizedException('Delivery price not found');
    // }

    // const basket = await this.basketModel
    //   .findOne({ user: req.user.id })
    //   .populate('Projects.Project')
    //   .populate('Projects.chocolates.chocolate')
    //   .populate('Projects.addOns.addOn');

    // if (!basket || basket.Projects?.length === 0) {
    //   throw new UnauthorizedException('Basket not found');
    // }

    // const basketProjects = basket.Projects.map((p) => ({
    //   Project: p.Project,
    //   quantity: p.quantity,
    //   price: p.price,
    //   chocolates: p.chocolates.map((c) => ({
    //     chocolate: c.chocolate,
    //     price: c.price,
    //   })),
    //   addOns: p.addOns.map((a) => ({
    //     addOn: a.addOn,
    //     price: a.price,
    //   })),
    // }));

    // const totalPrice = basket.totalBasketPrice + deliveryPrice.DeliveryPrice;
    // const order = await this.orderModel.create({
    //   basket: basketProjects,
    //   user: req?.user.id,
    //   address: createOrderDto.address,
    //   phone: createOrderDto.phone,
    //   name: createOrderDto.name,
    //   isPaid: createOrderDto.isPaid,
    //   totalPrice: totalPrice,
    //   orderNumber: OrderNumber,
    //   deliveryPrice: deliveryPrice.DeliveryPrice,
    // });
    // basket.Projects = [];
    // basket.totalBasketPrice = 0;
    // await basket.save();

    const payload = {
      amount: '100', // المبلغ بالقرش
      currency: 'EGP',
      payment_methods: ['card'],
      description: 'Order Description',
      metadata: {
        name: 'test',
        phone: '01000000000',
        address: 'test',
      },
      billing_data: {
        first_name: 'test',
        last_name: 'test',
        phone_number: '01000000000',
        email: 'test@example.com',
        country: 'EGY',
        city: 'Cairo',
        street: 'Street',
        building: '10',
        floor: '1',
        apartment: '1',
        state: 'Cairo',
      },
      // إضافة الـ URLs المهمة
      notification_url: 'https://your-domain.com/webhook/paymob',
      redirection_url: 'https://your-frontend.com/payment-result',
    };

    try {
      const response = await firstValueFrom(
        this.http.post(this.PAYMOB_API, payload, {
          headers: {
            // الطريقة الصحيحة للـ Authorization
            Authorization: `Token ${this.SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      // الطريقة الأولى: استخدام الـ client_secret
      const paymentUrl = `https://accept.paymob.com/standalone/?publicKey=${response.data.client_secret}`;

      // الطريقة الثانية: إذا كان فيه payment_url في الـ response
      const directPaymentUrl =
        response.data.payment_url || response.data.iframe_url;

      return {
        status: 'success',
        intentionId: response.data.id,
        clientSecret: response.data.client_secret,
        // رابط الدفع الرئيسي
        paymentUrl: directPaymentUrl || paymentUrl,
        // رابط احتياطي
        alternativePaymentUrl: paymentUrl,
        data: {
          id: response.data.id,
          amount: response.data.amount,
          currency: response.data.currency,
          status: response.data.status,
          created_at: response.data.created_at,
        },
      };
    } catch (e) {
      throw new UnauthorizedException('Something went wrong:' + e);
    }
  }

  async findAll(req) {
    if (req.user.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const order = await this.orderModel
      .find() // فقط الطلبات اللي عندها على الأقل مشروع واحد
      .sort({ createdAt: -1 })
      .lean()
      .populate('user')
      .populate({
        path: 'basket.Project',
        model: 'Project',
      })
      .populate({
        path: 'basket.chocolates.chocolate',
        model: 'TypeOfChocolate',
      })
      .populate({
        path: 'basket.addOns.addOn',
        model: 'AddOn',
      });

    return {
      count: order.length,
      status: 'success',
      order,
    };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { Basket, BasketDocument } from './entities/basket.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../projects/entities/project.entity';
import { Types } from 'mongoose';
@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket.name)
    private readonly basketModel: Model<BasketDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}
  async create(createBasketDto: CreateBasketDto, req) {
    if (req?.user.isAdmin === true) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }

    if (req?.user.id !== createBasketDto?.user) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }

    const basket = await this.basketModel.findOne({
      user: createBasketDto.user,
    });
    const preparedProjects = await Promise.all(
      createBasketDto.Projects.map(async (project) => {
        const projectData = await this.projectModel
          .findById(project.Project)
          .exec();
        if (!projectData) {
          throw new NotFoundException(
            `Project with ID ${project.Project} not found`,
          );
        }

        function getChocolateTotalPrice(
          chocolates?: { price?: number }[],
        ): number {
          if (!chocolates || chocolates.length === 0) {
            return 0;
          }

          return chocolates.reduce(
            (total, choco) => total + (choco.price || 0),
            0,
          );
        }

        function getAddOnsTotalPrice(addOns?: { price?: number }[]): number {
          if (!addOns || addOns.length === 0) {
            return 0;
          }

          return addOns.reduce((total, choco) => total + (choco.price || 0), 0);
        }

        let finalPrice = 0;
        if (getChocolateTotalPrice(project.chocolates) === 0) {
          finalPrice =
            Number(projectData?.price) + getAddOnsTotalPrice(project.addOns);
        } else if (project?.chocolates?.length === 1) {
          finalPrice =
            Number(projectData?.price) +
            getAddOnsTotalPrice(project.addOns) +
            getChocolateTotalPrice(project.chocolates);
        } else {
          const total =
            Number(projectData?.price) +
            getChocolateTotalPrice(project.chocolates);

          const percentage = total * 0.1;

          finalPrice =
            Number(projectData?.price) +
            getAddOnsTotalPrice(project.addOns) +
            percentage;
        }

        return {
          _id: new Types.ObjectId(), // Add a new ObjectId for the _id property
          Project: new Types.ObjectId(project.Project),
          chocolates: (project?.chocolates ?? []).map((chocolate) => ({
            chocolate: new Types.ObjectId(chocolate?.chocolate),
            price: chocolate?.price ?? 0,
          })),
          addOns: (project?.addOns ?? []).map((addOn) => ({
            addOn: new Types.ObjectId(addOn?.addOn),
            price: addOn?.price ?? 0,
          })),
          quantity: project.quantity,
          price: Number(finalPrice * project.quantity) || 0,
        };
      }),
    );

    const BasketPrice = preparedProjects.reduce(
      (total, project) => total + project.price,
      0,
    );
    let updatedBasket: BasketDocument;
    if (!basket) {
      updatedBasket = await this.basketModel.create({
        user: req?.user.id,
        Projects: preparedProjects,
        totalBasketPrice: BasketPrice,
      });
    } else {
      basket.Projects.push(...preparedProjects);
      basket.totalBasketPrice += preparedProjects.reduce(
        (sum, p) => sum + p.price,
        0,
      );
      updatedBasket = await basket.save();
    }
    return {
      status: 'success',
      basket: updatedBasket,
    };
  }

  async findAll(req) {
    const user = req.user.id;
    if (req.user.isAdmin === true) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    const basket = await this.basketModel
      .findOne({ user: user })
      .populate('Projects.Project')
      .populate('Projects.chocolates.chocolate')
      .populate('Projects.addOns.addOn')
      .exec();

    return {
      status: 'success',
      basket,
    };
  }

  async remove(id: string, req) {
    if (req.user.isAdmin === true) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }

    const basket = await this.basketModel.findOne({ user: req.user.id }).exec();
    if (!basket) {
      throw new NotFoundException('Basket not found');
    }

    const projectToRemove = basket.Projects.find((p) => String(p._id) === id);

    if (!projectToRemove) {
      throw new NotFoundException('Project not found in basket');
    }

    const priceToRemove =
      typeof projectToRemove.price === 'number' ? projectToRemove.price : 0;

    // احذف العنصر بالكامل
    const indexToRemove = basket.Projects.findIndex(
      (p) => String(p._id) === id,
    );
    if (indexToRemove !== -1) {
      basket.Projects.splice(indexToRemove, 1);
    }

    // خصم سعره من السلة
    basket.totalBasketPrice = Math.max(
      0,
      Number(basket.totalBasketPrice || 0) - priceToRemove,
    );

    await basket.save();

    return {
      status: 'success',
      message: 'Project (with all data) removed successfully',
    };
  }
}

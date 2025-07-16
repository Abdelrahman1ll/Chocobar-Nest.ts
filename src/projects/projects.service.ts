/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDocument, Project } from './entities/project.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleDriveService } from '../google-drive/google-drive.service';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    private readonly googleDriveService: GoogleDriveService,
  ) {}
  async create(
    createProjectDto: CreateProjectDto,
    req,
    file: Express.Multer.File,
  ) {
    if (req.user?.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    try {
      const chocolates = Array.isArray(createProjectDto.chocolates)
        ? createProjectDto.chocolates
        : JSON.parse(createProjectDto.chocolates || '[]');

      const addOns = Array.isArray(createProjectDto.addOns)
        ? createProjectDto.addOns
        : JSON.parse(createProjectDto.addOns || '[]');

      if (chocolates) {
        createProjectDto.chocolates = chocolates.map((chocolate) => {
          return {
            chocolate: chocolate.chocolate,
            price: chocolate.price,
          };
        });
      }

      if (addOns) {
        createProjectDto.addOns = addOns.map((addOn) => {
          return {
            addOn: addOn.addOn,
            price: addOn.price,
          };
        });
      }

      if (file) {
        const imageUrl = await this.googleDriveService.uploadFileToDrive(file);
        if (!imageUrl) {
          throw new Error('فشل رفع الصورة');
        }
        createProjectDto.image = imageUrl;
      }

      if (!createProjectDto.image) {
        throw new Error('الصورة مطلوبة');
      }

      const project = new this.projectModel(createProjectDto);
      await project.save();

      return {
        status: 'success',
        project,
      };
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }

  async findAll(search: string) {
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const projects = await this.projectModel
      .find(filter)
      .populate('chocolates.chocolate')
      .populate('addOns.addOn');

    return {
      number: projects.length,
      status: 'success',
      projects,
    };
  }

  async findOne(id: string) {
    const project = await this.projectModel
      .findById(id)
      .populate('chocolates.chocolate')
      .populate('addOns.addOn');

    return {
      status: 'success',
      project,
    };
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    req,
    file: Express.Multer.File,
  ) {
    if (req.user?.isAdmin === false) {
      throw new UnauthorizedException('You are not allowed on this router.');
    }
    try {
      const chocolates = Array.isArray(updateProjectDto.chocolates)
        ? updateProjectDto.chocolates
        : JSON.parse(updateProjectDto.chocolates || '[]');

      const addOns = Array.isArray(updateProjectDto.addOns)
        ? updateProjectDto.addOns
        : JSON.parse(updateProjectDto.addOns || '[]');

      if (chocolates) {
        updateProjectDto.chocolates = chocolates.map((chocolate) => {
          return {
            chocolate: chocolate.chocolate,
            price: chocolate.price,
          };
        });
      }

      if (addOns) {
        updateProjectDto.addOns = addOns.map((addOn) => {
          return {
            addOn: addOn.addOn,
            price: addOn.price,
          };
        });
      }

      if (file) {
        updateProjectDto.image =
          await this.googleDriveService.uploadFileToDrive(file);
      }

      const project = await this.projectModel.findByIdAndUpdate(
        id,
        updateProjectDto,
        { new: true },
      );

      return {
        status: 'success',
        project,
      };
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }
}

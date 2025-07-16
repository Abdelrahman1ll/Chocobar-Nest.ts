import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.create(createProjectDto, req, file);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.projectsService.findAll(search ?? '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.update(id, updateProjectDto, req, file);
  }
}

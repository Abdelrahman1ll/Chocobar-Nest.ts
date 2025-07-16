import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOfChocolateModule } from 'src/type-of-chocolate/type-of-chocolate.module';
import { AddOnsModule } from 'src/add-ons/add-ons.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema, Project } from './entities/project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { GoogleDriveModule } from 'src/google-drive/google-drive.module';
@Module({
  imports: [
    GoogleDriveModule,
    AuthModule,
    TypeOfChocolateModule,
    AddOnsModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [MongooseModule, ProjectsService],
})
export class ProjectsModule {}

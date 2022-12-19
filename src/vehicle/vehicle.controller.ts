import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { VehicleDto } from './vehicle.dto';
import { VehicleEntity } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage,
} from 'src/helpers/image-storage';
import { Res, UploadedFile } from '@nestjs/common/decorators';
import { Observable, of, switchMap } from 'rxjs';
import { join } from 'path';

@Controller('vehicles')
@UseInterceptors(BusinessErrorsInterceptor)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  async findAll() {
    return await this.vehicleService.findAll();
  }

  @Get(':vehicleId')
  async findOne(@Param('vehicleId') vehicleId: string) {
    return await this.vehicleService.findOne(vehicleId);
  }

  @Post()
  async create(@Body() vehicleDto: VehicleDto) {
    const vehicle: VehicleEntity = plainToInstance(VehicleEntity, vehicleDto);
    return await this.vehicleService.create(vehicle);
  }

  @Put(':vehicleId')
  async update(
    @Param('vehicleId') vehicleId: string,
    @Body() vehicleDto: VehicleDto,
  ) {
    const vehicle: VehicleEntity = plainToInstance(VehicleEntity, vehicleDto);
    return await this.vehicleService.update(vehicleId, vehicle);
  }

  @Delete(':vehicleId')
  @HttpCode(204)
  async delete(@Param('vehicleId') vehicleId: string) {
    return await this.vehicleService.delete(vehicleId);
  }

  @Post(':vehicleId/upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('vehicleId') vehicleId: string,
  ) {
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap(async (isFileLegit: boolean) => {
        if (isFileLegit) {
          let respService = await this.vehicleService.updateVehicleImageById(
            vehicleId,
            fileName,
          );
          return {
            modifiedFileName: file.filename,
          };
        }
        removeFile(fullImagePath);
        return of({ error: 'File content does not match extension!' });
      }),
    );
  }

  @Get(':vehicleId/image')
  async findImage(
    @Param('vehicleId') vehicleId: string,
    @Res() res,
  ): Promise<Observable<Object>> {
    return await this.vehicleService.findImageNameByVehicleId(vehicleId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }
}

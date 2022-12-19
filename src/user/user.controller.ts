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
  Query,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage,
} from 'src/helpers/image-storage';
import { Res, UploadedFile } from '@nestjs/common/decorators';
import { Observable, of, switchMap } from 'rxjs';
import { join } from 'path';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('p') page: number,
    @Query('email') email: string,
    @Query('isDriver') isDriver: boolean,
  ) {
    let data = await this.userService.findAll(page, email, isDriver);
    return { page: page, numItems: data.length, data: data };
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @Post()
  async create(@Body() userDto: UserDto) {
    const user: UserEntity = plainToInstance(UserEntity, userDto);
    user.createdDate = new Date();
    return await this.userService.create(user);
  }

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() userDto: UserDto) {
    const user: UserEntity = plainToInstance(UserEntity, userDto);
    return await this.userService.update(userId, user);
  }

  @Delete(':userId')
  @HttpCode(204)
  async delete(@Param('userId') userId: string) {
    return await this.userService.delete(userId);
  }

  @Put(':userId/convertToDriver')
  async convertToDriver(@Param('userId') userId: string) {
    let user = await this.userService.findOne(userId);
    user.isDriver = true;
    return await this.userService.update(userId, user);
  }

  @Post(':userId/upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
  ) {
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap(async (isFileLegit: boolean) => {
        if (isFileLegit) {
          let respService = await this.userService.updateUserImageById(
            userId,
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

  @Get(':userId/image')
  async findImage(
    @Param('userId') userId: string,
    @Res() res,
  ): Promise<Observable<Object>> {
    return await this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }
}

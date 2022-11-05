import { Controller, UseInterceptors, Post, Param } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UserDriverTravelByDriverService } from './user-driver-travel-by-driver.service';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserDriverTravelByDriverController {
  constructor(
    private readonly userDriverTravelService: UserDriverTravelByDriverService,
  ) {}

  @Post(':userId/driverTravels/:driverTravelId')
  async addDriverTravelUser(
    @Param('userId') userId: string,
    @Param('driverTravelId') driverTravelId: string,
  ) {
    return await this.userDriverTravelService.addDriverTravelByDriverUser(
      userId,
      driverTravelId,
    );
  }
}

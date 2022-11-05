import { Controller, UseInterceptors, Post, Param } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { DriverTravelUserService } from './driver-travel-user.service';

@Controller('driverTravels')
@UseInterceptors(BusinessErrorsInterceptor)
export class DriverTravelUserController {
  constructor(
    private readonly driverTravelUserService: DriverTravelUserService,
  ) {}

  @Post(':driverTravelId/passengers/:userId')
  async addDriverTravelUser(
    @Param('driverTravelId') driverTravelId: string,
    @Param('userId') userId: string,
  ) {
    return await this.driverTravelUserService.addUserDriverTravel(
      driverTravelId,
      userId,
    );
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserVehicleService } from './user-vehicle.service';
import { UserEntity } from '../user/user.entity';
import { VehicleEntity } from '../vehicle/vehicle.entity';

describe('UserVehicleService', () => {
  let service: UserVehicleService;
  let userRepository: Repository<UserEntity>;
  let vehicleRepository: Repository<VehicleEntity>;
  let user: UserEntity;
  let vehiclesList: VehicleEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserVehicleService],
    }).compile();

    service = module.get<UserVehicleService>(UserVehicleService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    vehicleRepository = module.get<Repository<VehicleEntity>>(
      getRepositoryToken(VehicleEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    vehicleRepository.clear();
    userRepository.clear();

    vehiclesList = [];
    for (let i = 0; i < 5; i++) {
      const vehicle: VehicleEntity = await vehicleRepository.save({
        licensePlate: faker.datatype.string(7),
        brand: faker.vehicle.vehicle(),
        serie: faker.vehicle.model(),
        model: faker.date.past().getFullYear().toString(),
        color: faker.vehicle.color(),
        soatExpedition: faker.date.past(),
        soatExpiration: faker.date.future(),
        type: 'CAR',
        photo: faker.image.imageUrl(),
      });
      vehiclesList.push(vehicle);
    }

    user = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: true,
      vehicles: vehiclesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addVehicleUser should add an vehicle to a user', async () => {
    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    const newUser: UserEntity = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: true,
    });

    const result: UserEntity = await service.addVehicleUser(
      newUser.id,
      newVehicle.id,
    );

    expect(result.vehicles.length).toBe(1);
    expect(result.vehicles[0]).not.toBeNull();
    expect(result.vehicles[0].licensePlate).toStrictEqual(
      newVehicle.licensePlate,
    );
    expect(result.vehicles[0].brand).toStrictEqual(newVehicle.brand);
    expect(result.vehicles[0].serie).toStrictEqual(newVehicle.serie);
    expect(result.vehicles[0].model).toStrictEqual(newVehicle.model);
    expect(result.vehicles[0].color).toStrictEqual(newVehicle.color);
    expect(result.vehicles[0].soatExpedition).toStrictEqual(
      newVehicle.soatExpedition,
    );
    expect(result.vehicles[0].soatExpiration).toStrictEqual(
      newVehicle.soatExpiration,
    );
    expect(result.vehicles[0].type).toStrictEqual(newVehicle.type);
    expect(result.vehicles[0].photo).toStrictEqual(newVehicle.photo);
  });

  it('addVehicleUser should thrown exception for an invalid vehicle', async () => {
    const newUser: UserEntity = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: false,
    });

    await expect(() =>
      service.addVehicleUser(newUser.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id was not found',
    );
  });

  it('addVehicleUser should throw an exception for an invalid user', async () => {
    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addVehicleUser('0', newVehicle.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('addVehicleUser should throw an exception for not driver user', async () => {
    let newUser = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: false,
      vehicles: vehiclesList,
    });

    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    await expect(() =>
      service.addVehicleUser(newUser.id, newVehicle.id),
    ).rejects.toHaveProperty('message', 'The user is not a driver');
  });

  it('findVehicleByUserIdVehicleId should return vehicle by user', async () => {
    const vehicle: VehicleEntity = vehiclesList[0];
    const storedVehicle: VehicleEntity =
      await service.findVehicleByUserIdVehicleId(user.id, vehicle.id);

    expect(storedVehicle).not.toBeNull();
    expect(storedVehicle.licensePlate).toStrictEqual(vehicle.licensePlate);
    expect(storedVehicle.brand).toStrictEqual(vehicle.brand);
    expect(storedVehicle.serie).toStrictEqual(vehicle.serie);
    expect(storedVehicle.model).toStrictEqual(vehicle.model);
    expect(storedVehicle.color).toStrictEqual(vehicle.color);
    expect(storedVehicle.soatExpedition).toStrictEqual(vehicle.soatExpedition);
    expect(storedVehicle.soatExpiration).toStrictEqual(vehicle.soatExpiration);
    expect(storedVehicle.type).toStrictEqual(vehicle.type);
    expect(storedVehicle.photo).toStrictEqual(vehicle.photo);
  });

  it('findVehicleByUserIdVehicleId should throw an exception for an invalid vehicle', async () => {
    await expect(() =>
      service.findVehicleByUserIdVehicleId(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id was not found',
    );
  });

  it('findVehicleByUserIdVehicleId should throw an exception for an invalid user', async () => {
    const vehicle: VehicleEntity = vehiclesList[0];
    await expect(() =>
      service.findVehicleByUserIdVehicleId('0', vehicle.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findVehicleByUserIdVehicleId should throw an exception for an vehicle not associated to the user', async () => {
    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    await expect(() =>
      service.findVehicleByUserIdVehicleId(user.id, newVehicle.id),
    ).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id is not associated to the user',
    );
  });

  it('findVehiclesByUserId should return vehicles by user', async () => {
    const vehicles: VehicleEntity[] = await service.findVehiclesByUserId(
      user.id,
    );
    expect(vehicles.length).toBe(5);
  });

  it('findVehiclesByUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findVehiclesByUserId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateVehiclesUser should update vehicles list for a user', async () => {
    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    const updatedUser: UserEntity = await service.associateVehiclesUser(
      user.id,
      [newVehicle],
    );
    expect(updatedUser.vehicles.length).toBe(1);

    expect(updatedUser.vehicles[0].licensePlate).toStrictEqual(
      newVehicle.licensePlate,
    );
    expect(updatedUser.vehicles[0].brand).toStrictEqual(newVehicle.brand);
    expect(updatedUser.vehicles[0].serie).toStrictEqual(newVehicle.serie);
    expect(updatedUser.vehicles[0].model).toStrictEqual(newVehicle.model);
    expect(updatedUser.vehicles[0].color).toStrictEqual(newVehicle.color);
    expect(updatedUser.vehicles[0].soatExpedition).toStrictEqual(
      newVehicle.soatExpedition,
    );
    expect(updatedUser.vehicles[0].soatExpiration).toStrictEqual(
      newVehicle.soatExpiration,
    );
    expect(updatedUser.vehicles[0].type).toStrictEqual(newVehicle.type);
    expect(updatedUser.vehicles[0].photo).toStrictEqual(newVehicle.photo);
  });

  it('associateVehiclesUser should throw an exception for an invalid user', async () => {
    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    await expect(() =>
      service.associateVehiclesUser('0', [newVehicle]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateVehiclesUser should throw an exception for an invalid vehicle', async () => {
    const newVehicle: VehicleEntity = vehiclesList[0];
    newVehicle.id = '0';

    await expect(() =>
      service.associateVehiclesUser(user.id, [newVehicle]),
    ).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id was not found',
    );
  });

  it('associateVehiclesUser should throw an exception for not driver user', async () => {
    let newUser = await userRepository.save({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      genre: 'MALE',
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      photo: faker.image.imageUrl(),
      idenficiationCard: faker.image.imageUrl(),
      about: faker.datatype.string(),
      score: faker.datatype.number({ min: 1, max: 5 }),
      drivingPass: faker.image.imageUrl(),
      state: 'ACTIVE',
      verifiedMail: faker.datatype.boolean(),
      verifiedPhone: faker.datatype.boolean(),
      verifiedIC: faker.datatype.boolean(),
      verifiedDrivingPass: faker.datatype.boolean(),
      verifiedUser: false,
      isDriver: false,
      vehicles: vehiclesList,
    });

    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    await expect(() =>
      service.associateVehiclesUser(newUser.id, [newVehicle]),
    ).rejects.toHaveProperty('message', 'The user is not a driver');
  });

  it('deleteVehicleToUser should remove an vehicle from a user', async () => {
    const vehicle: VehicleEntity = vehiclesList[0];

    await service.deleteVehicleUser(user.id, vehicle.id);

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['vehicles'],
    });
    const deletedVehicle: VehicleEntity = storedUser.vehicles.find(
      (a) => a.id === vehicle.id,
    );

    expect(deletedVehicle).toBeUndefined();
  });

  it('deleteVehicleToUser should thrown an exception for an invalid vehicle', async () => {
    await expect(() =>
      service.deleteVehicleUser(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id was not found',
    );
  });

  it('deleteVehicleToUser should thrown an exception for an invalid user', async () => {
    const vehicle: VehicleEntity = vehiclesList[0];
    await expect(() =>
      service.deleteVehicleUser('0', vehicle.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteVehicleToUser should thrown an exception for an non asocciated vehicle', async () => {
    const newVehicle: VehicleEntity = await vehicleRepository.save({
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    });

    await expect(() =>
      service.deleteVehicleUser(user.id, newVehicle.id),
    ).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id is not associated to the user',
    );
  });
});

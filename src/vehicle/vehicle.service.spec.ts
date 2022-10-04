import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { VehicleEntity } from './vehicle.entity';
import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;
  let repository: Repository<VehicleEntity>;
  let vehiclesList: VehicleEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [VehicleService],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    repository = module.get<Repository<VehicleEntity>>(
      getRepositoryToken(VehicleEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    vehiclesList = [];
    for (let i = 0; i < 5; i++) {
      const vehicle: VehicleEntity = await repository.save({
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
  };

  it('findAll should return all vehicles', async () => {
    const vehicles: VehicleEntity[] = await service.findAll();
    expect(vehicles).not.toBeNull();
    expect(vehicles).toHaveLength(vehiclesList.length);
  });

  it('findOne should return a vehicle by id', async () => {
    const storedVehicle: VehicleEntity = vehiclesList[0];
    const vehicle: VehicleEntity = await service.findOne(storedVehicle.id);
    expect(vehicle).not.toBeNull();
    expect(vehicle.licensePlate).toEqual(storedVehicle.licensePlate);
    expect(vehicle.brand).toEqual(storedVehicle.brand);
    expect(vehicle.serie).toEqual(storedVehicle.serie);
    expect(vehicle.model).toEqual(storedVehicle.model);
    expect(vehicle.color).toEqual(storedVehicle.color);
    expect(vehicle.soatExpedition).toEqual(storedVehicle.soatExpedition);
    expect(vehicle.soatExpiration).toEqual(storedVehicle.soatExpiration);
    expect(vehicle.type).toEqual(storedVehicle.type);
    expect(vehicle.photo).toEqual(storedVehicle.photo);
  });

  it('findOne should throw an exception for an invalid vehicle', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id was not found',
    );
  });

  it('create should return a new vehicle', async () => {
    const vehicle: VehicleEntity = {
      id: '',
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
      user: null,
      driverTravels: null,
    };

    const newVehicle: VehicleEntity = await service.create(vehicle);
    expect(newVehicle).not.toBeNull();

    const storedVehicle: VehicleEntity = await repository.findOne({
      where: { id: newVehicle.id },
    });
    expect(vehicle).not.toBeNull();
    expect(vehicle.licensePlate.length).toEqual(7);
    expect(vehicle.soatExpedition.getTime()).toBeLessThan(Date.now());
    expect(vehicle.soatExpiration.getTime()).toBeGreaterThan(Date.now());
    expect(vehicle.licensePlate).toEqual(storedVehicle.licensePlate);
    expect(vehicle.brand).toEqual(storedVehicle.brand);
    expect(vehicle.serie).toEqual(storedVehicle.serie);
    expect(vehicle.model).toEqual(storedVehicle.model);
    expect(vehicle.color).toEqual(storedVehicle.color);
    expect(vehicle.soatExpedition).toEqual(storedVehicle.soatExpedition);
    expect(vehicle.soatExpiration).toEqual(storedVehicle.soatExpiration);
    expect(vehicle.type).toEqual(storedVehicle.type);
    expect(vehicle.photo).toEqual(storedVehicle.photo);
  });

  it('create should throw an exception for an invalid type of vehicle', async () => {
    const vehicle: VehicleEntity = {
      id: '',
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: faker.datatype.string(),
      photo: faker.image.imageUrl(),
      user: null,
      driverTravels: null,
    };
    await expect(() => service.create(vehicle)).rejects.toHaveProperty(
      'message',
      'Invalid type of vehicle',
    );
  });

  it('update should modify a vehicle', async () => {
    const vehicle: VehicleEntity = vehiclesList[0];
    vehicle.licensePlate = faker.datatype.string(7);
    vehicle.brand = faker.vehicle.vehicle();
    vehicle.serie = faker.vehicle.model();
    vehicle.model = faker.date.past().getFullYear().toString();
    vehicle.color = faker.vehicle.color();
    vehicle.soatExpedition = faker.date.past();
    vehicle.soatExpiration = faker.date.future();
    vehicle.type = 'CAR';
    vehicle.photo = faker.image.imageUrl();
    const updatedVehicle: VehicleEntity = await service.update(
      vehicle.id,
      vehicle,
    );
    expect(updatedVehicle).not.toBeNull();
    const storedVehicle: VehicleEntity = await repository.findOne({
      where: { id: vehicle.id },
    });
    expect(storedVehicle).not.toBeNull();
    expect(vehicle.licensePlate.length).toEqual(7);
    expect(vehicle.soatExpedition.getTime()).toBeLessThan(Date.now());
    expect(vehicle.soatExpiration.getTime()).toBeGreaterThan(Date.now());
    expect(vehicle.licensePlate).toEqual(storedVehicle.licensePlate);
    expect(vehicle.brand).toEqual(storedVehicle.brand);
    expect(vehicle.serie).toEqual(storedVehicle.serie);
    expect(vehicle.model).toEqual(storedVehicle.model);
    expect(vehicle.color).toEqual(storedVehicle.color);
    expect(vehicle.soatExpedition).toEqual(storedVehicle.soatExpedition);
    expect(vehicle.soatExpiration).toEqual(storedVehicle.soatExpiration);
    expect(vehicle.type).toEqual(storedVehicle.type);
    expect(vehicle.photo).toEqual(storedVehicle.photo);
  });

  it('update should throw an exception for an invalid vehicle', async () => {
    let vehicle: VehicleEntity = vehiclesList[0];
    vehicle = {
      ...vehicle,
      licensePlate: faker.datatype.string(7),
      brand: faker.vehicle.vehicle(),
      serie: faker.vehicle.model(),
      model: faker.date.past().getFullYear().toString(),
      color: faker.vehicle.color(),
      soatExpedition: faker.date.past(),
      soatExpiration: faker.date.future(),
      type: 'CAR',
      photo: faker.image.imageUrl(),
    };
    await expect(() => service.update('0', vehicle)).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid type of vehicle', async () => {
    let vehicle: VehicleEntity = vehiclesList[0];
    vehicle = {
      ...vehicle,
      type: faker.datatype.string(),
    };
    await expect(() =>
      service.update(vehicle.id, vehicle),
    ).rejects.toHaveProperty('message', 'Invalid type of vehicle');
  });

  it('delete should remove a vehicle', async () => {
    const vehicle: VehicleEntity = vehiclesList[0];
    await service.delete(vehicle.id);
    const deletedVehicle: VehicleEntity = await repository.findOne({
      where: { id: vehicle.id },
    });
    expect(deletedVehicle).toBeNull();
  });

  it('delete should throw an exception for an invalid vehicle', async () => {
    const vehicle: VehicleEntity = vehiclesList[0];
    await service.delete(vehicle.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The vehicle with the given id was not found',
    );
  });
});

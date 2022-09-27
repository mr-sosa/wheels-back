import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { AddressEntity } from './address.entity';
import { AddressService } from './address.service';

describe('AddressService', () => {
  let service: AddressService;
  let repository: Repository<AddressEntity>;
  let addresssList: AddressEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AddressService],
    }).compile();

    service = module.get<AddressService>(AddressService);
    repository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    addresssList = [];
    for (let i = 0; i < 5; i++) {
      const address: AddressEntity = await repository.save({
        country: faker.address.country(),
        department: faker.address.state(),
        city: faker.address.cityName(),
        location: faker.datatype.string(),
        name: faker.datatype.string(),
        mainRoad: faker.datatype.string(),
        firstNumber: faker.datatype.number({ min: 1 }),
        firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
        fisrtQuadrant: faker.address.cardinalDirection().toLocaleUpperCase(),
        secondNumber: faker.datatype.number({ min: 1 }),
        secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
        secondQuadrant: faker.address.cardinalDirection().toLocaleUpperCase(),
        plateNumber: parseInt(faker.address.buildingNumber()),
        description: faker.datatype.string(),
      });
      addresssList.push(address);
    }
  };

  it('findAll should return all addresss', async () => {
    const addresss: AddressEntity[] = await service.findAll();
    expect(addresss).not.toBeNull();
    expect(addresss).toHaveLength(addresssList.length);
  });

  it('findOne should return a address by id', async () => {
    const storedAddress: AddressEntity = addresssList[0];
    const address: AddressEntity = await service.findOne(storedAddress.id);
    expect(address).not.toBeNull();
    expect(address.country).toEqual(storedAddress.country);
    expect(address.department).toEqual(storedAddress.department);
    expect(address.city).toEqual(storedAddress.city);
    expect(address.location).toEqual(storedAddress.location);
    expect(address.name).toEqual(storedAddress.name);
    expect(address.mainRoad).toEqual(storedAddress.mainRoad);
    expect(address.firstNumber).toEqual(storedAddress.firstNumber);
    expect(address.firstLetter).toEqual(storedAddress.firstLetter);
    expect(address.fisrtQuadrant).toEqual(storedAddress.fisrtQuadrant);
    expect(address.secondNumber).toEqual(storedAddress.secondNumber);
    expect(address.secondLetter).toEqual(storedAddress.secondLetter);
    expect(address.secondQuadrant).toEqual(storedAddress.secondQuadrant);
    expect(address.plateNumber).toEqual(storedAddress.plateNumber);
    expect(address.description).toEqual(storedAddress.description);
  });

  it('findOne should throw an exception for an invalid address', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The address with the given id was not found',
    );
  });

  it('create should return a new address', async () => {
    const address: AddressEntity = {
      id: '',
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: faker.datatype.string(),
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: faker.address.cardinalDirection().toLocaleUpperCase(),
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: faker.address.cardinalDirection().toLocaleUpperCase(),
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
      users: null,
      originPassengerTravels: null,
      destinationPassengerTravels: null,
      originDriverTravels: null,
      destinationDriverTravels: null,
      point: null,
    };

    const newAddress: AddressEntity = await service.create(address);
    expect(newAddress).not.toBeNull();

    const storedAddress: AddressEntity = await repository.findOne({
      where: { id: newAddress.id },
    });
    expect(address).not.toBeNull();
    expect(address.firstNumber).toBeGreaterThanOrEqual(1);
    expect(address.secondNumber).toBeGreaterThanOrEqual(1);
    expect(address.plateNumber).toBeGreaterThanOrEqual(1);
    expect(address.country).toEqual(storedAddress.country);
    expect(address.department).toEqual(storedAddress.department);
    expect(address.city).toEqual(storedAddress.city);
    expect(address.location).toEqual(storedAddress.location);
    expect(address.name).toEqual(storedAddress.name);
    expect(address.mainRoad).toEqual(storedAddress.mainRoad);
    expect(address.firstNumber).toEqual(storedAddress.firstNumber);
    expect(address.firstLetter).toEqual(storedAddress.firstLetter);
    expect(address.fisrtQuadrant).toEqual(storedAddress.fisrtQuadrant);
    expect(address.secondNumber).toEqual(storedAddress.secondNumber);
    expect(address.secondLetter).toEqual(storedAddress.secondLetter);
    expect(address.secondQuadrant).toEqual(storedAddress.secondQuadrant);
    expect(address.plateNumber).toEqual(storedAddress.plateNumber);
    expect(address.description).toEqual(storedAddress.description);
  });

  it('update should modify a address', async () => {
    const address: AddressEntity = addresssList[0];
    address.country = faker.address.country();
    address.department = faker.address.state();
    address.city = faker.address.cityName();
    address.location = faker.datatype.string();
    address.name = faker.datatype.string();
    address.mainRoad = faker.datatype.string();
    address.firstNumber = faker.datatype.number({ min: 1 });
    address.firstLetter = faker.datatype.string(1).toLocaleUpperCase();
    address.fisrtQuadrant = faker.address
      .cardinalDirection()
      .toLocaleUpperCase();
    address.secondNumber = faker.datatype.number({ min: 1 });
    address.secondLetter = faker.datatype.string(1).toLocaleUpperCase();
    address.secondQuadrant = faker.address
      .cardinalDirection()
      .toLocaleUpperCase();
    address.plateNumber = parseInt(faker.address.buildingNumber());
    address.description = faker.datatype.string();
    const updatedAddress: AddressEntity = await service.update(
      address.id,
      address,
    );
    expect(updatedAddress).not.toBeNull();
    const storedAddress: AddressEntity = await repository.findOne({
      where: { id: address.id },
    });
    expect(storedAddress).not.toBeNull();
    expect(address.firstNumber).toBeGreaterThanOrEqual(1);
    expect(address.secondNumber).toBeGreaterThanOrEqual(1);
    expect(address.plateNumber).toBeGreaterThanOrEqual(1);
    expect(address.country).toEqual(storedAddress.country);
    expect(address.department).toEqual(storedAddress.department);
    expect(address.city).toEqual(storedAddress.city);
    expect(address.location).toEqual(storedAddress.location);
    expect(address.name).toEqual(storedAddress.name);
    expect(address.mainRoad).toEqual(storedAddress.mainRoad);
    expect(address.firstNumber).toEqual(storedAddress.firstNumber);
    expect(address.firstLetter).toEqual(storedAddress.firstLetter);
    expect(address.fisrtQuadrant).toEqual(storedAddress.fisrtQuadrant);
    expect(address.secondNumber).toEqual(storedAddress.secondNumber);
    expect(address.secondLetter).toEqual(storedAddress.secondLetter);
    expect(address.secondQuadrant).toEqual(storedAddress.secondQuadrant);
    expect(address.plateNumber).toEqual(storedAddress.plateNumber);
    expect(address.description).toEqual(storedAddress.description);
  });

  it('update should throw an exception for an invalid address', async () => {
    let address: AddressEntity = addresssList[0];
    address = {
      ...address,
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: faker.datatype.string(),
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: faker.address.cardinalDirection().toLocaleUpperCase(),
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: faker.address.cardinalDirection().toLocaleUpperCase(),
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
    };
    await expect(() => service.update('0', address)).rejects.toHaveProperty(
      'message',
      'The address with the given id was not found',
    );
  });

  it('delete should remove a address', async () => {
    const address: AddressEntity = addresssList[0];
    await service.delete(address.id);
    const deletedAddress: AddressEntity = await repository.findOne({
      where: { id: address.id },
    });
    expect(deletedAddress).toBeNull();
  });

  it('delete should throw an exception for an invalid address', async () => {
    const address: AddressEntity = addresssList[0];
    await service.delete(address.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The address with the given id was not found',
    );
  });
});

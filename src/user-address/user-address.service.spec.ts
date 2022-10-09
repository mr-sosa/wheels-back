import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserAddressService } from './user-address.service';
import { UserEntity } from '../user/user.entity';
import { AddressEntity } from '../address/address.entity';

describe('UserAddressService', () => {
  let service: UserAddressService;
  let userRepository: Repository<UserEntity>;
  let addressRepository: Repository<AddressEntity>;
  let user: UserEntity;
  let addressesList: AddressEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserAddressService],
    }).compile();

    service = module.get<UserAddressService>(UserAddressService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    addressRepository.clear();
    userRepository.clear();

    addressesList = [];
    for (let i = 0; i < 5; i++) {
      const address: AddressEntity = await addressRepository.save({
        country: faker.address.country(),
        department: faker.address.state(),
        city: faker.address.cityName(),
        location: faker.datatype.string(),
        name: faker.datatype.string(),
        mainRoad: 'STREET',
        firstNumber: faker.datatype.number({ min: 1 }),
        firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
        fisrtQuadrant: '',
        secondNumber: faker.datatype.number({ min: 1 }),
        secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
        secondQuadrant: '',
        plateNumber: parseInt(faker.address.buildingNumber()),
        description: faker.datatype.string(),
      });
      addressesList.push(address);
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
      addresses: addressesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAddressUser should add an address to a user', async () => {
    const newAddress: AddressEntity = await addressRepository.save({
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: 'STREET',
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: '',
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: '',
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
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

    const result: UserEntity = await service.addAddressUser(
      newUser.id,
      newAddress.id,
    );

    expect(result.addresses.length).toBe(1);
    expect(result.addresses[0]).not.toBeNull();
    expect(result.addresses[0].firstNumber).toBeGreaterThanOrEqual(1);
    expect(result.addresses[0].secondNumber).toBeGreaterThanOrEqual(1);
    expect(result.addresses[0].plateNumber).toBeGreaterThanOrEqual(1);
    expect(result.addresses[0].country).toEqual(newAddress.country);
    expect(result.addresses[0].department).toEqual(newAddress.department);
    expect(result.addresses[0].city).toEqual(newAddress.city);
    expect(result.addresses[0].location).toEqual(newAddress.location);
    expect(result.addresses[0].name).toEqual(newAddress.name);
    expect(result.addresses[0].mainRoad).toEqual(newAddress.mainRoad);
    expect(result.addresses[0].firstNumber).toEqual(newAddress.firstNumber);
    expect(result.addresses[0].firstLetter).toEqual(newAddress.firstLetter);
    expect(result.addresses[0].fisrtQuadrant).toEqual(newAddress.fisrtQuadrant);
    expect(result.addresses[0].secondNumber).toEqual(newAddress.secondNumber);
    expect(result.addresses[0].secondLetter).toEqual(newAddress.secondLetter);
    expect(result.addresses[0].secondQuadrant).toEqual(
      newAddress.secondQuadrant,
    );
    expect(result.addresses[0].plateNumber).toEqual(newAddress.plateNumber);
    expect(result.addresses[0].description).toEqual(newAddress.description);
  });

  it('addAddressUser should thrown exception for an invalid address', async () => {
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
      service.addAddressUser(newUser.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The address with the given id was not found',
    );
  });

  it('addAddressUser should throw an exception for an invalid user', async () => {
    const newAddress: AddressEntity = await addressRepository.save({
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: 'STREET',
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: '',
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: '',
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
    });

    await expect(() =>
      service.addAddressUser('0', newAddress.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findAddressByUserIdAddressId should return address by user', async () => {
    const address: AddressEntity = addressesList[0];
    const storedAddress: AddressEntity =
      await service.findAddressByUserIdAddressId(user.id, address.id);

    expect(storedAddress).not.toBeNull();
    expect(storedAddress.firstNumber).toBeGreaterThanOrEqual(1);
    expect(storedAddress.secondNumber).toBeGreaterThanOrEqual(1);
    expect(storedAddress.plateNumber).toBeGreaterThanOrEqual(1);
    expect(storedAddress.country).toEqual(address.country);
    expect(storedAddress.department).toEqual(address.department);
    expect(storedAddress.city).toEqual(address.city);
    expect(storedAddress.location).toEqual(address.location);
    expect(storedAddress.name).toEqual(address.name);
    expect(storedAddress.mainRoad).toEqual(address.mainRoad);
    expect(storedAddress.firstNumber).toEqual(address.firstNumber);
    expect(storedAddress.firstLetter).toEqual(address.firstLetter);
    expect(storedAddress.fisrtQuadrant).toEqual(address.fisrtQuadrant);
    expect(storedAddress.secondNumber).toEqual(address.secondNumber);
    expect(storedAddress.secondLetter).toEqual(address.secondLetter);
    expect(storedAddress.secondQuadrant).toEqual(address.secondQuadrant);
    expect(storedAddress.plateNumber).toEqual(address.plateNumber);
    expect(storedAddress.description).toEqual(address.description);
  });

  it('findAddressByUserIdAddressId should throw an exception for an invalid address', async () => {
    await expect(() =>
      service.findAddressByUserIdAddressId(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The address with the given id was not found',
    );
  });

  it('findAddressByUserIdAddressId should throw an exception for an invalid user', async () => {
    const address: AddressEntity = addressesList[0];
    await expect(() =>
      service.findAddressByUserIdAddressId('0', address.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findAddressByUserIdAddressId should throw an exception for an address not associated to the user', async () => {
    const newAddress: AddressEntity = await addressRepository.save({
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: 'STREET',
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: '',
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: '',
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
    });

    await expect(() =>
      service.findAddressByUserIdAddressId(user.id, newAddress.id),
    ).rejects.toHaveProperty(
      'message',
      'The address with the given id is not associated to the user',
    );
  });

  it('findAddresssByUserId should return addresses by user', async () => {
    const addresses: AddressEntity[] = await service.findAddresssByUserId(
      user.id,
    );
    expect(addresses.length).toBe(5);
  });

  it('findAddresssByUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findAddresssByUserId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateAddresssUser should update addresses list for a user', async () => {
    const newAddress: AddressEntity = await addressRepository.save({
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: 'STREET',
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: '',
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: '',
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
    });

    const updatedUser: UserEntity = await service.associateAddresssUser(
      user.id,
      [newAddress],
    );
    expect(updatedUser.addresses.length).toBe(1);
    expect(updatedUser.addresses[0].firstNumber).toBeGreaterThanOrEqual(1);
    expect(updatedUser.addresses[0].secondNumber).toBeGreaterThanOrEqual(1);
    expect(updatedUser.addresses[0].plateNumber).toBeGreaterThanOrEqual(1);
    expect(updatedUser.addresses[0].country).toEqual(newAddress.country);
    expect(updatedUser.addresses[0].department).toEqual(newAddress.department);
    expect(updatedUser.addresses[0].city).toEqual(newAddress.city);
    expect(updatedUser.addresses[0].location).toEqual(newAddress.location);
    expect(updatedUser.addresses[0].name).toEqual(newAddress.name);
    expect(updatedUser.addresses[0].mainRoad).toEqual(newAddress.mainRoad);
    expect(updatedUser.addresses[0].firstNumber).toEqual(
      newAddress.firstNumber,
    );
    expect(updatedUser.addresses[0].firstLetter).toEqual(
      newAddress.firstLetter,
    );
    expect(updatedUser.addresses[0].fisrtQuadrant).toEqual(
      newAddress.fisrtQuadrant,
    );
    expect(updatedUser.addresses[0].secondNumber).toEqual(
      newAddress.secondNumber,
    );
    expect(updatedUser.addresses[0].secondLetter).toEqual(
      newAddress.secondLetter,
    );
    expect(updatedUser.addresses[0].secondQuadrant).toEqual(
      newAddress.secondQuadrant,
    );
    expect(updatedUser.addresses[0].plateNumber).toEqual(
      newAddress.plateNumber,
    );
    expect(updatedUser.addresses[0].description).toEqual(
      newAddress.description,
    );
  });

  it('associateAddresssUser should throw an exception for an invalid user', async () => {
    const newAddress: AddressEntity = await addressRepository.save({
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: 'STREET',
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: '',
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: '',
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
    });

    await expect(() =>
      service.associateAddresssUser('0', [newAddress]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateAddresssUser should throw an exception for an invalid address', async () => {
    const newAddress: AddressEntity = addressesList[0];
    newAddress.id = '0';

    await expect(() =>
      service.associateAddresssUser(user.id, [newAddress]),
    ).rejects.toHaveProperty(
      'message',
      'The address with the given id was not found',
    );
  });

  it('deleteAddressToUser should remove an address from a user', async () => {
    const address: AddressEntity = addressesList[0];

    await service.deleteAddressUser(user.id, address.id);

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['addresses'],
    });
    const deletedAddress: AddressEntity = storedUser.addresses.find(
      (a) => a.id === address.id,
    );

    expect(deletedAddress).toBeUndefined();
  });

  it('deleteAddressToUser should thrown an exception for an invalid address', async () => {
    await expect(() =>
      service.deleteAddressUser(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The address with the given id was not found',
    );
  });

  it('deleteAddressToUser should thrown an exception for an invalid user', async () => {
    const address: AddressEntity = addressesList[0];
    await expect(() =>
      service.deleteAddressUser('0', address.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteAddressToUser should thrown an exception for an non asocciated address', async () => {
    const newAddress: AddressEntity = await addressRepository.save({
      country: faker.address.country(),
      department: faker.address.state(),
      city: faker.address.cityName(),
      location: faker.datatype.string(),
      name: faker.datatype.string(),
      mainRoad: 'STREET',
      firstNumber: faker.datatype.number({ min: 1 }),
      firstLetter: faker.datatype.string(1).toLocaleUpperCase(),
      fisrtQuadrant: '',
      secondNumber: faker.datatype.number({ min: 1 }),
      secondLetter: faker.datatype.string(1).toLocaleUpperCase(),
      secondQuadrant: '',
      plateNumber: parseInt(faker.address.buildingNumber()),
      description: faker.datatype.string(),
    });

    await expect(() =>
      service.deleteAddressUser(user.id, newAddress.id),
    ).rejects.toHaveProperty(
      'message',
      'The address with the given id is not associated to the user',
    );
  });
});

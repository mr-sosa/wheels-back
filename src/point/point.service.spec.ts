import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PointEntity } from './point.entity';
import { PointService } from './point.service';

describe('PointService', () => {
  let service: PointService;
  let repository: Repository<PointEntity>;
  let pointsList: PointEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PointService],
    }).compile();

    service = module.get<PointService>(PointService);
    repository = module.get<Repository<PointEntity>>(
      getRepositoryToken(PointEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    pointsList = [];
    for (let i = 0; i < 5; i++) {
      const point: PointEntity = await repository.save({
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      });
      pointsList.push(point);
    }
  };

  it('findAll should return all points', async () => {
    const points: PointEntity[] = await service.findAll();
    expect(points).not.toBeNull();
    expect(points).toHaveLength(pointsList.length);
  });

  it('findOne should return a point by id', async () => {
    const storedPoint: PointEntity = pointsList[0];
    const point: PointEntity = await service.findOne(storedPoint.id);
    expect(point).not.toBeNull();
    expect(point.latitude).toEqual(storedPoint.latitude);
    expect(point.longitude).toEqual(storedPoint.longitude);
  });

  it('findOne should throw an exception for an invalid point', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The point with the given id was not found',
    );
  });

  it('create should return a new point', async () => {
    const point: PointEntity = {
      id: '',
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      address: null,
      stepStart: null,
      stepEnd: null,
    };

    const newPoint: PointEntity = await service.create(point);
    expect(newPoint).not.toBeNull();

    const storedPoint: PointEntity = await repository.findOne({
      where: { id: newPoint.id },
    });
    expect(point).not.toBeNull();
    expect(point.latitude).toEqual(storedPoint.latitude);
    expect(point.longitude).toEqual(storedPoint.longitude);
  });

  it('update should modify a point', async () => {
    const point: PointEntity = pointsList[0];
    point.latitude = faker.address.latitude();
    point.longitude = faker.address.longitude();
    const updatedPoint: PointEntity = await service.update(point.id, point);
    expect(updatedPoint).not.toBeNull();
    const storedPoint: PointEntity = await repository.findOne({
      where: { id: point.id },
    });
    expect(storedPoint).not.toBeNull();
    expect(point.latitude).toEqual(storedPoint.latitude);
    expect(point.longitude).toEqual(storedPoint.longitude);
  });

  it('update should throw an exception for an invalid point', async () => {
    let point: PointEntity = pointsList[0];
    point = {
      ...point,
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
    };
    await expect(() => service.update('0', point)).rejects.toHaveProperty(
      'message',
      'The point with the given id was not found',
    );
  });

  it('delete should remove a point', async () => {
    const point: PointEntity = pointsList[0];
    await service.delete(point.id);
    const deletedPoint: PointEntity = await repository.findOne({
      where: { id: point.id },
    });
    expect(deletedPoint).toBeNull();
  });

  it('delete should throw an exception for an invalid point', async () => {
    const point: PointEntity = pointsList[0];
    await service.delete(point.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The point with the given id was not found',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { OpinionEntity } from './opinion.entity';
import { OpinionService } from './opinion.service';

describe('OpinionService', () => {
  let service: OpinionService;
  let repository: Repository<OpinionEntity>;
  let opinionsList: OpinionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [OpinionService],
    }).compile();

    service = module.get<OpinionService>(OpinionService);
    repository = module.get<Repository<OpinionEntity>>(
      getRepositoryToken(OpinionEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    opinionsList = [];
    for (let i = 0; i < 5; i++) {
      const opinion: OpinionEntity = await repository.save({
        comment: faker.datatype.string(),
        date: faker.date.past(),
        score: 'BAD',
      });
      opinionsList.push(opinion);
    }
  };

  it('findAll should return all opinions', async () => {
    const opinions: OpinionEntity[] = await service.findAll();
    expect(opinions).not.toBeNull();
    expect(opinions).toHaveLength(opinionsList.length);
  });

  it('findOne should return a opinion by id', async () => {
    const storedOpinion: OpinionEntity = opinionsList[0];
    const opinion: OpinionEntity = await service.findOne(storedOpinion.id);
    expect(opinion).not.toBeNull();
    expect(opinion.comment).toEqual(storedOpinion.comment);
    expect(opinion.score).toEqual(storedOpinion.score);
    expect(opinion.date).toEqual(storedOpinion.date);
  });

  it('findOne should throw an exception for an invalid opinion', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The opinion with the given id was not found',
    );
  });

  it('create should return a new opinion', async () => {
    const opinion: OpinionEntity = {
      id: '',
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
      users: null,
      commentators: null,
    };

    const newOpinion: OpinionEntity = await service.create(opinion);
    expect(newOpinion).not.toBeNull();

    const storedOpinion: OpinionEntity = await repository.findOne({
      where: { id: newOpinion.id },
    });
    expect(opinion).not.toBeNull();
    expect(opinion.comment).toEqual(storedOpinion.comment);
    expect(opinion.score).toEqual(storedOpinion.score);
    expect(opinion.date).toEqual(storedOpinion.date);
  });

  it('create should return a new opinion', async () => {
    const opinion: OpinionEntity = {
      id: '',
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: faker.datatype.string(),
      users: null,
      commentators: null,
    };

    await expect(() => service.create(opinion)).rejects.toHaveProperty(
      'message',
      'Invalid typeScore of opinion',
    );
  });

  it('update should modify a opinion', async () => {
    const opinion: OpinionEntity = opinionsList[0];
    opinion.comment = faker.datatype.string();
    opinion.date = faker.date.past();
    opinion.score = 'BAD';
    const updatedOpinion: OpinionEntity = await service.update(
      opinion.id,
      opinion,
    );
    expect(updatedOpinion).not.toBeNull();
    const storedOpinion: OpinionEntity = await repository.findOne({
      where: { id: opinion.id },
    });
    expect(storedOpinion).not.toBeNull();
    expect(opinion.date.getTime()).toBeLessThanOrEqual(Date.now());
    expect(opinion.comment).toEqual(storedOpinion.comment);
    expect(opinion.score).toEqual(storedOpinion.score);
    expect(opinion.date).toEqual(storedOpinion.date);
  });

  it('update should throw an exception for an invalid opinion', async () => {
    let opinion: OpinionEntity = opinionsList[0];
    opinion = {
      ...opinion,
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    };
    await expect(() => service.update('0', opinion)).rejects.toHaveProperty(
      'message',
      'The opinion with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid typeScore of opinion', async () => {
    let opinion: OpinionEntity = opinionsList[0];
    opinion = {
      ...opinion,
      score: faker.datatype.string(),
    };
    await expect(() =>
      service.update(opinion.id, opinion),
    ).rejects.toHaveProperty('message', 'Invalid typeScore of opinion');
  });

  it('delete should remove a opinion', async () => {
    const opinion: OpinionEntity = opinionsList[0];
    await service.delete(opinion.id);
    const deletedOpinion: OpinionEntity = await repository.findOne({
      where: { id: opinion.id },
    });
    expect(deletedOpinion).toBeNull();
  });

  it('delete should throw an exception for an invalid opinion', async () => {
    const opinion: OpinionEntity = opinionsList[0];
    await service.delete(opinion.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The opinion with the given id was not found',
    );
  });
});

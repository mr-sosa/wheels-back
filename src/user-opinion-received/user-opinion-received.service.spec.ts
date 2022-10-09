import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserOpinionReceivedService } from './user-opinion-received.service';
import { UserEntity } from '../user/user.entity';
import { OpinionEntity } from '../opinion/opinion.entity';

describe('UserOpinionReceivedService', () => {
  let service: UserOpinionReceivedService;
  let userRepository: Repository<UserEntity>;
  let opinionReceivedRepository: Repository<OpinionEntity>;
  let user: UserEntity;
  let opinionReceivedsList: OpinionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserOpinionReceivedService],
    }).compile();

    service = module.get<UserOpinionReceivedService>(
      UserOpinionReceivedService,
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    opinionReceivedRepository = module.get<Repository<OpinionEntity>>(
      getRepositoryToken(OpinionEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    opinionReceivedRepository.clear();
    userRepository.clear();

    opinionReceivedsList = [];
    for (let i = 0; i < 5; i++) {
      const opinionReceived: OpinionEntity =
        await opinionReceivedRepository.save({
          comment: faker.datatype.string(),
          date: faker.date.past(),
          score: 'BAD',
        });
      opinionReceivedsList.push(opinionReceived);
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
      opinionsReceived: opinionReceivedsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addOpinionUser should add an opinionReceived to a user', async () => {
    const newOpinion: OpinionEntity = await opinionReceivedRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
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

    const result: UserEntity = await service.addOpinionUser(
      newUser.id,
      newOpinion.id,
    );

    expect(result.opinionsReceived.length).toBe(1);
    expect(result.opinionsReceived[0]).not.toBeNull();
    expect(result.opinionsReceived[0].comment).toStrictEqual(
      newOpinion.comment,
    );
    expect(result.opinionsReceived[0].date).toStrictEqual(newOpinion.date);
    expect(result.opinionsReceived[0].score).toStrictEqual(newOpinion.score);
  });

  it('addOpinionUser should thrown exception for an invalid opinionReceived', async () => {
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
      service.addOpinionUser(newUser.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The opinionReceived with the given id was not found',
    );
  });

  it('addOpinionUser should throw an exception for an invalid user', async () => {
    const newOpinion: OpinionEntity = await opinionReceivedRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    await expect(() =>
      service.addOpinionUser('0', newOpinion.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findOpinionByUserIdOpinionId should return opinionReceived by user', async () => {
    const opinionReceived: OpinionEntity = opinionReceivedsList[0];
    const storedOpinion: OpinionEntity =
      await service.findOpinionByUserIdOpinionId(user.id, opinionReceived.id);

    expect(storedOpinion).not.toBeNull();
    expect(storedOpinion.comment).toStrictEqual(opinionReceived.comment);
    expect(storedOpinion.date).toStrictEqual(opinionReceived.date);
    expect(storedOpinion.score).toStrictEqual(opinionReceived.score);
  });

  it('findOpinionByUserIdOpinionId should throw an exception for an invalid opinionReceived', async () => {
    await expect(() =>
      service.findOpinionByUserIdOpinionId(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The opinionReceived with the given id was not found',
    );
  });

  it('findOpinionByUserIdOpinionId should throw an exception for an invalid user', async () => {
    const opinionReceived: OpinionEntity = opinionReceivedsList[0];
    await expect(() =>
      service.findOpinionByUserIdOpinionId('0', opinionReceived.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findOpinionByUserIdOpinionId should throw an exception for an opinionReceived not associated to the user', async () => {
    const newOpinion: OpinionEntity = await opinionReceivedRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    await expect(() =>
      service.findOpinionByUserIdOpinionId(user.id, newOpinion.id),
    ).rejects.toHaveProperty(
      'message',
      'The opinionReceived with the given id is not associated to the user',
    );
  });

  it('findOpinionsByUserId should return opinionReceiveds by user', async () => {
    const opinionReceiveds: OpinionEntity[] =
      await service.findOpinionsByUserId(user.id);
    expect(opinionReceiveds.length).toBe(5);
  });

  it('findOpinionsByUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findOpinionsByUserId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateOpinionsUser should update opinionReceiveds list for a user', async () => {
    const newOpinion: OpinionEntity = await opinionReceivedRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    const updatedUser: UserEntity = await service.associateOpinionsUser(
      user.id,
      [newOpinion],
    );
    expect(updatedUser.opinionsReceived.length).toBe(1);
    expect(updatedUser.opinionsReceived[0].comment).toStrictEqual(
      newOpinion.comment,
    );
    expect(updatedUser.opinionsReceived[0].date).toStrictEqual(newOpinion.date);
    expect(updatedUser.opinionsReceived[0].score).toStrictEqual(
      newOpinion.score,
    );
  });

  it('associateOpinionsUser should throw an exception for an invalid user', async () => {
    const newOpinion: OpinionEntity = await opinionReceivedRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    await expect(() =>
      service.associateOpinionsUser('0', [newOpinion]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateOpinionsUser should throw an exception for an invalid opinionReceived', async () => {
    const newOpinion: OpinionEntity = opinionReceivedsList[0];
    newOpinion.id = '0';

    await expect(() =>
      service.associateOpinionsUser(user.id, [newOpinion]),
    ).rejects.toHaveProperty(
      'message',
      'The opinionReceived with the given id was not found',
    );
  });

  it('deleteOpinionToUser should remove an opinionReceived from a user', async () => {
    const opinionReceived: OpinionEntity = opinionReceivedsList[0];

    await service.deleteOpinionUser(user.id, opinionReceived.id);

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['opinionsReceived'],
    });
    const deletedOpinion: OpinionEntity = storedUser.opinionsReceived.find(
      (a) => a.id === opinionReceived.id,
    );

    expect(deletedOpinion).toBeUndefined();
  });

  it('deleteOpinionToUser should thrown an exception for an invalid opinionReceived', async () => {
    await expect(() =>
      service.deleteOpinionUser(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The opinionReceived with the given id was not found',
    );
  });

  it('deleteOpinionToUser should thrown an exception for an invalid user', async () => {
    const opinionReceived: OpinionEntity = opinionReceivedsList[0];
    await expect(() =>
      service.deleteOpinionUser('0', opinionReceived.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteOpinionToUser should thrown an exception for an non asocciated opinionReceived', async () => {
    const newOpinion: OpinionEntity = await opinionReceivedRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    await expect(() =>
      service.deleteOpinionUser(user.id, newOpinion.id),
    ).rejects.toHaveProperty(
      'message',
      'The opinionReceived with the given id is not associated to the user',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserOpinionMadeService } from './user-opinion-made.service';
import { UserEntity } from '../user/user.entity';
import { OpinionEntity } from '../opinion/opinion.entity';

describe('UserOpinionMadeService', () => {
  let service: UserOpinionMadeService;
  let userRepository: Repository<UserEntity>;
  let opinionMadeRepository: Repository<OpinionEntity>;
  let user: UserEntity;
  let opinionMadesList: OpinionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserOpinionMadeService],
    }).compile();

    service = module.get<UserOpinionMadeService>(UserOpinionMadeService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    opinionMadeRepository = module.get<Repository<OpinionEntity>>(
      getRepositoryToken(OpinionEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    opinionMadeRepository.clear();
    userRepository.clear();

    opinionMadesList = [];
    for (let i = 0; i < 5; i++) {
      const opinionMade: OpinionEntity = await opinionMadeRepository.save({
        comment: faker.datatype.string(),
        date: faker.date.past(),
        score: 'BAD',
      });
      opinionMadesList.push(opinionMade);
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
      opinionsMade: opinionMadesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addOpinionUser should add an opinionMade to a user', async () => {
    const newOpinion: OpinionEntity = await opinionMadeRepository.save({
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

    expect(result.opinionsMade.length).toBe(1);
    expect(result.opinionsMade[0]).not.toBeNull();
    expect(result.opinionsMade[0].comment).toStrictEqual(newOpinion.comment);
    expect(result.opinionsMade[0].date).toStrictEqual(newOpinion.date);
    expect(result.opinionsMade[0].score).toStrictEqual(newOpinion.score);
  });

  it('addOpinionUser should thrown exception for an invalid opinionMade', async () => {
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
      'The opinionMade with the given id was not found',
    );
  });

  it('addOpinionUser should throw an exception for an invalid user', async () => {
    const newOpinion: OpinionEntity = await opinionMadeRepository.save({
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

  it('findOpinionByUserIdOpinionId should return opinionMade by user', async () => {
    const opinionMade: OpinionEntity = opinionMadesList[0];
    const storedOpinion: OpinionEntity =
      await service.findOpinionByUserIdOpinionId(user.id, opinionMade.id);

    expect(storedOpinion).not.toBeNull();
    expect(storedOpinion.comment).toStrictEqual(opinionMade.comment);
    expect(storedOpinion.date).toStrictEqual(opinionMade.date);
    expect(storedOpinion.score).toStrictEqual(opinionMade.score);
  });

  it('findOpinionByUserIdOpinionId should throw an exception for an invalid opinionMade', async () => {
    await expect(() =>
      service.findOpinionByUserIdOpinionId(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The opinionMade with the given id was not found',
    );
  });

  it('findOpinionByUserIdOpinionId should throw an exception for an invalid user', async () => {
    const opinionMade: OpinionEntity = opinionMadesList[0];
    await expect(() =>
      service.findOpinionByUserIdOpinionId('0', opinionMade.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findOpinionByUserIdOpinionId should throw an exception for an opinionMade not associated to the user', async () => {
    const newOpinion: OpinionEntity = await opinionMadeRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    await expect(() =>
      service.findOpinionByUserIdOpinionId(user.id, newOpinion.id),
    ).rejects.toHaveProperty(
      'message',
      'The opinionMade with the given id is not associated to the user',
    );
  });

  it('findOpinionsByUserId should return opinionMades by user', async () => {
    const opinionMades: OpinionEntity[] = await service.findOpinionsByUserId(
      user.id,
    );
    expect(opinionMades.length).toBe(5);
  });

  it('findOpinionsByUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findOpinionsByUserId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('associateOpinionsUser should update opinionMades list for a user', async () => {
    const newOpinion: OpinionEntity = await opinionMadeRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    const updatedUser: UserEntity = await service.associateOpinionsUser(
      user.id,
      [newOpinion],
    );
    expect(updatedUser.opinionsMade.length).toBe(1);
    expect(updatedUser.opinionsMade[0].comment).toStrictEqual(
      newOpinion.comment,
    );
    expect(updatedUser.opinionsMade[0].date).toStrictEqual(newOpinion.date);
    expect(updatedUser.opinionsMade[0].score).toStrictEqual(newOpinion.score);
  });

  it('associateOpinionsUser should throw an exception for an invalid user', async () => {
    const newOpinion: OpinionEntity = await opinionMadeRepository.save({
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

  it('associateOpinionsUser should throw an exception for an invalid opinionMade', async () => {
    const newOpinion: OpinionEntity = opinionMadesList[0];
    newOpinion.id = '0';

    await expect(() =>
      service.associateOpinionsUser(user.id, [newOpinion]),
    ).rejects.toHaveProperty(
      'message',
      'The opinionMade with the given id was not found',
    );
  });

  it('deleteOpinionToUser should remove an opinionMade from a user', async () => {
    const opinionMade: OpinionEntity = opinionMadesList[0];

    await service.deleteOpinionUser(user.id, opinionMade.id);

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['opinionsMade'],
    });
    const deletedOpinion: OpinionEntity = storedUser.opinionsMade.find(
      (a) => a.id === opinionMade.id,
    );

    expect(deletedOpinion).toBeUndefined();
  });

  it('deleteOpinionToUser should thrown an exception for an invalid opinionMade', async () => {
    await expect(() =>
      service.deleteOpinionUser(user.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The opinionMade with the given id was not found',
    );
  });

  it('deleteOpinionToUser should thrown an exception for an invalid user', async () => {
    const opinionMade: OpinionEntity = opinionMadesList[0];
    await expect(() =>
      service.deleteOpinionUser('0', opinionMade.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteOpinionToUser should thrown an exception for an non asocciated opinionMade', async () => {
    const newOpinion: OpinionEntity = await opinionMadeRepository.save({
      comment: faker.datatype.string(),
      date: faker.date.past(),
      score: 'BAD',
    });

    await expect(() =>
      service.deleteOpinionUser(user.id, newOpinion.id),
    ).rejects.toHaveProperty(
      'message',
      'The opinionMade with the given id is not associated to the user',
    );
  });
});

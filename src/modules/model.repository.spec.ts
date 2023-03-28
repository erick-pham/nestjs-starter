import {
  Repository,
  Entity,
  And,
  Equal,
  In,
  LessThan,
  Like,
  MoreThanOrEqual,
  Not,
  LessThanOrEqual,
  Connection
} from 'typeorm';
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  createConnection
} from 'typeorm';

import { BaseRepository } from './model.repository';

@Entity({ name: 'TestEntity' })
export class TestEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name?: string;

  @Column({ nullable: true })
  description?: string;
}

describe('BaseRepository', () => {
  let repository: BaseRepository<TestEntity>;
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      entities: [TestEntity],
      synchronize: true
    });
    const entityRepository = connection.getRepository(TestEntity);
    repository = new BaseRepository<TestEntity>(entityRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('getInstance', () => {
    it('should return instance', async () => {
      expect(repository.getInstance()).not.toBeNull();
    });
  });

  describe('createMany', () => {
    it('should return entity is created', async () => {
      const entities = repository.createMany([
        { name: 'createMany1' },
        { name: 'createMany2' }
      ]);
      const result = await repository.saveMany(entities);
      expect(result.length).toBe(2);

      const firstItem = await repository.findOneById(result[0].id);
      expect(firstItem).toMatchObject(result[0]);

      const secondItem = await repository.findOneBy({ id: result[1].id });
      expect(secondItem).toMatchObject(result[1]);
    });

    it('should return entity is created', async () => {
      const entities = repository.createMany([
        { name: 'createMany1' },
        { name: 'createMany2' }
      ]);
      const result = await repository.saveManyWithOptions(entities);
      expect(result.length).toBe(2);
    });
  });

  describe('update', () => {
    it('should return number of record updated', async () => {
      const entity = repository.create({ name: 'update1' });
      const result = await repository.save(entity);
      const updatedRs = await repository.update(
        {
          id: result.id
        },
        {
          name: 'update1 effected'
        }
      );

      expect(updatedRs.affected).toBe(1);
    });
  });

  describe('search', () => {
    it('should return number of record', async () => {
      const entity = repository.create({ name: 'search' });
      await repository.save(entity);
      const searchRs = await repository.search({
        pageNumber: 1,
        pageSize: 10,
        searchTerm: 'search'
      });

      expect(searchRs.items.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return null when entity is not found', async () => {
      const result = await repository.findOne({ where: { id: '123' } });
      expect(result).toBeNull();
    });

    it('should return entity when it exists', async () => {
      const entity = repository.create({ name: 'test' });
      await repository.saveWithOptions(entity);

      const result = await repository.findOne({ where: { name: 'test' } });
      expect(result).toBeDefined();
      expect(result!.name).toEqual('test');
    });
  });

  describe('find', () => {
    it('should return empty array when no entities are found', async () => {
      const result = await repository.find({ where: { id: '123' } });
      expect(result).toHaveLength(0);
    });

    it('should return array of entities when they exist', async () => {
      const entity1 = repository.create({ name: 'testABC' });
      const entity2 = repository.create({ name: 'testABC' });
      await repository.save(entity1);
      await repository.save(entity2);

      const result = await repository.find({
        where: {
          name: 'testABC'
        }
      });
      expect(result).toHaveLength(2);
    });
  });
});

describe('BaseRepository', () => {
  describe('getSorts', () => {
    let repo: BaseRepository<any>;

    beforeEach(() => {
      const entity = {
        metadata: {
          ownColumns: [
            { propertyName: 'id' },
            { propertyName: 'name' },
            { propertyName: 'description' }
          ]
        }
      } as Repository<TestEntity>;
      // entity.metadata = {
      //   ownColumns: [
      //     { propertyName: 'id' },
      //     { propertyName: 'name' },
      //     { propertyName: 'description' }
      //   ]
      // };
      repo = new BaseRepository(entity);
    });

    it('should return an empty object when input is undefined', () => {
      const result = repo.getSorts(undefined);
      expect(result).toEqual({});
    });

    it('should return an empty object when input is an empty string', () => {
      const result = repo.getSorts('');
      expect(result).toEqual({});
    });

    it('should return an empty object when input is invalid', () => {
      const result = repo.getSorts('foo,bar');
      expect(result).toEqual({});
    });

    it('should return sort options when input is valid', () => {
      const result = repo.getSorts('name,-description');
      expect(result).toEqual({
        name: 'ASC',
        description: 'DESC'
      });
    });

    it('should ignore invalid sort options', () => {
      const result = repo.getSorts('foo,-bar,name,-description');
      expect(result).toEqual({
        name: 'ASC',
        description: 'DESC'
      });
    });
  });

  describe('selectAttributes', () => {
    let repo: BaseRepository<any>;

    beforeEach(() => {
      const entity = {
        metadata: {
          ownColumns: [
            { propertyName: 'attribute1' },
            { propertyName: 'attribute2' },
            { propertyName: 'attribute3' }
          ]
        }
      } as Repository<TestEntity>;
      repo = new BaseRepository(entity);
    });
    it('returns all attributes if no parameter is passed in', () => {
      const result = repo.selectAttributes(undefined);
      expect(result).toEqual(['attribute1', 'attribute2', 'attribute3']);
    });

    it('returns only the selected attributes and excludes the unselected attributes', () => {
      const result = repo.selectAttributes('attribute1,!attribute2,attribute3');
      expect(result).toEqual(['attribute1', 'attribute3']);
    });

    it('returns all attributes except the unselected attributes if no selected attributes are passed in', () => {
      const result = repo.selectAttributes('!attribute2, !attribute4');
      expect(result).toEqual(['attribute1', 'attribute3']);
    });
  });

  describe('getFilters', () => {
    let repo: BaseRepository<any>;

    beforeEach(() => {
      const entity = {
        metadata: {
          ownColumns: [
            { propertyName: 'name' },
            { propertyName: 'age' },
            { propertyName: 'city' },
            { propertyName: 'country' },
            { propertyName: 'job' }
          ]
        }
      } as Repository<TestEntity>;
      repo = new BaseRepository(entity);
    });

    it('should return an empty object if inputs is undefined', () => {
      const result = repo.getFilters(undefined);
      expect(result).toEqual({});
    });

    it('should return an empty object if all keys in inputs are not included in attributes', () => {
      const inputs = {
        foo: { eq: 'bar' },
        baz: { in: '1,2,3' }
      };
      const result = repo.getFilters(inputs);
      expect(result).toEqual({});
    });

    it('should return correct filters for valid inputs', () => {
      const inputs: any = {
        name: { eq: 'John' }
        // age: { gte: '18', lt: '30' }
        // city: { in: 'New York,Los Angeles' },
        // country: { notIn: 'China,India' },
        // job: {
        //   startsWith: 'Software',
        //   endsWith: 'Engineer',
        //   substring: 'Developer'
        // }
      };
      const result = repo.getFilters(inputs);
      expect(result).toMatchObject({
        name: Equal('John')
        // age: And(MoreThanOrEqual('18'), LessThan('30'))
        // city: In(['New York', 'Los Angeles']),
        // country: Not(In(['China', 'India'])),
        // job: And(Like('Software%'), Like('%Engineer'), Like('%Developer%'))
      });
      // expect(repo.getFilters({ age: { gte: '18' } })).toMatchObject({
      //   age: MoreThanOrEqual('18')
      // });
      expect(repo.getFilters({ age: { neq: '18' } })).toMatchObject({
        age: Not('18')
      });
      expect(repo.getFilters({ age: { gte: '18' } })).toMatchObject({
        age: MoreThanOrEqual('18')
      });
      expect(repo.getFilters({ age: { lte: '18' } })).toMatchObject({
        age: LessThanOrEqual('18')
      });
      expect(
        repo.getFilters({ city: { or: 'New York,Los Angeles' } })
      ).toMatchObject({
        city: In(['New York', 'Los Angeles'])
      });
      expect(
        repo.getFilters({ city: { in: 'New York,Los Angeles' } })
      ).toMatchObject({
        city: In(['New York', 'Los Angeles'])
      });
      expect(
        repo.getFilters({ country: { notIn: 'New York,Los Angeles' } })
      ).toMatchObject({
        country: Not(In(['New York', 'Los Angeles']))
      });
      expect(
        repo.getFilters({ job: { startsWith: 'Software' } })
      ).toMatchObject({
        job: Like('Software%')
      });
      expect(repo.getFilters({ job: { endsWith: 'Engineer' } })).toMatchObject({
        job: Like('%Engineer')
      });
      expect(
        repo.getFilters({ job: { subString: 'Developer' } })
      ).toMatchObject({
        job: Like('%Developer%')
      });
    });
  });
});

import {
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  FindManyOptions,
  SaveOptions,
  DeepPartial,
  FindOneOptions
} from 'typeorm';

export interface BaseInterfaceRepository<T extends ObjectLiteral> {
  getInstance(): Repository<T>;
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveWithOptions(data: DeepPartial<T>, options?: SaveOptions): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  saveManyWithOptions(
    data: DeepPartial<T>[],
    options?: SaveOptions
  ): Promise<T[]>;
  findOneBy(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[]
  ): Promise<T | null>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
}

export class BaseRepository<T extends ObjectLiteral>
  implements BaseInterfaceRepository<T>
{
  private baseRepository: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.baseRepository = entity;
  }
  // constructor(private baseRepository: Repository<T>) {
  //   super(
  //     baseRepository.target,
  //     baseRepository.manager,
  //     baseRepository.queryRunner
  //   );
  // }
  getInstance() {
    return this.baseRepository;
  }

  create(data: DeepPartial<T>): T {
    return this.baseRepository.create(data);
  }

  createMany(data: DeepPartial<T>[]): T[] {
    return this.baseRepository.create(data);
  }

  save(data: DeepPartial<T>): Promise<T> {
    return this.baseRepository.save(data);
  }

  saveWithOptions(data: DeepPartial<T>, options?: SaveOptions): Promise<T> {
    return this.baseRepository.save(data, options);
  }

  saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.baseRepository.save(data);
  }

  saveManyWithOptions(
    data: DeepPartial<T>[],
    options?: SaveOptions
  ): Promise<T[]> {
    return this.baseRepository.save(data, options);
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.baseRepository.findOne(options);
  }

  findOneBy(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[]
  ): Promise<T | null> {
    return this.baseRepository.findOneBy(options);
  }

  find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.baseRepository.find(options);
  }
}

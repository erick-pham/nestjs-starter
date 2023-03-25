import { PaginationParams } from 'src/shared/pagination-params';
import {
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  FindManyOptions,
  SaveOptions,
  DeepPartial,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsSelect,
  Equal,
  In,
  Not,
  MoreThanOrEqual,
  LessThanOrEqual,
  Like,
  ObjectID,
  UpdateResult
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
  findOneById(id: number | string | Date | ObjectID): Promise<T | null>;
  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult>;
}

export class BaseRepository<T extends ObjectLiteral>
  implements BaseInterfaceRepository<T>
{
  private baseRepository: Repository<T>;
  private attributes: string[];
  protected constructor(entity: Repository<T>) {
    this.baseRepository = entity;
    this.attributes = entity.metadata.ownColumns.map(
      (column) => column.propertyName
    );
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

  findOneById(id: any): Promise<T | null> {
    const options: FindOptionsWhere<T> = {
      id: id
    };
    return this.baseRepository.findOneBy(options);
  }

  find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.baseRepository.find(options);
  }

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult> {
    return this.baseRepository.update(criteria, partialEntity);
  }

  getSorts(string: string | undefined): Record<string, string> {
    const result: Record<string, string> = {};
    if (string) {
      string.split(',').forEach((i) => {
        if (i[0] === '-') {
          if (!this.attributes.includes(i.slice(1))) {
            return;
          }
        } else {
          if (!this.attributes.includes(i)) {
            return;
          }
        }
        if (i[0] === '-') {
          result[i.slice(1)] = 'DESC';
        } else {
          result[i] = 'ASC';
        }
      });
    }

    return result;
  }

  selectAttributes(attribute: string | undefined) {
    if (!attribute || attribute.length === 0) {
      return this.attributes;
    } else {
      const attributes = attribute.split(',');
      let rs = [];
      let unselectedAtt = attributes.filter((att) => att.includes('!'));
      unselectedAtt = unselectedAtt.map((i) => i.slice(1));
      rs = attributes.filter((att) => !att.includes('!'));
      if (rs.length === 0) {
        rs = this.attributes.filter((i) => !unselectedAtt.includes(i));
      }
      return rs.filter((r) => this.attributes.includes(r));
    }
  }

  getFilters(
    inputs: Record<string, Record<string, string>> | undefined
  ): Record<string, object> {
    // const inputs: Record<string, Record<string, string>> = {};
    if (!inputs) {
      return {};
    }
    const result: Record<string, object> = {};
    Object.keys(inputs).forEach((key) => {
      if (!this.attributes.includes(key)) {
        return;
      }
      result[key] = {};
      Object.keys(inputs[key]).forEach((operator) => {
        if (operator === 'eq') {
          result[key] = Equal(inputs[key][operator]);
        }
        if (operator === 'or') {
          result[key] = In(inputs[key][operator].split(','));
        }
        if (operator === 'neq') {
          result[key] = Not(inputs[key][operator]);
        }
        if (operator === 'in') {
          result[key] = In(inputs[key][operator].split(','));
        }
        if (operator === 'notIn') {
          result[key] = Not(In(inputs[key][operator].split(',')));
        }
        if (operator === 'gte') {
          result[key] = MoreThanOrEqual(inputs[key][operator]);
        }
        if (operator === 'lte') {
          result[key] = LessThanOrEqual(inputs[key][operator]);
        }
        if (operator === 'startsWith') {
          result[key] = Like(`${inputs[key][operator]}%`);
        }
        if (operator === 'endsWith') {
          result[key] = Like(`%${inputs[key][operator]}`);
        }
        if (operator === 'substring') {
          result[key] = Like(`%${inputs[key][operator]}%`);
        }
      });
    });
    return result;
  }

  async search({
    searchTerm,
    pageSize,
    pageNumber,
    attributes,
    order,
    filters
  }: PaginationParams) {
    const [items, count] = await this.baseRepository.findAndCount({
      order: this.getSorts(order) as unknown as FindOptionsOrder<T>,
      where: this.getFilters(filters) as FindOptionsWhere<T>,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      select: this.selectAttributes(
        attributes
      ) as unknown as FindOptionsSelect<T>
    });

    return {
      items,
      numbersOfRecord: count,
      numbersOfPage: Math.ceil(count / (pageSize || 1))
    };
  }
}

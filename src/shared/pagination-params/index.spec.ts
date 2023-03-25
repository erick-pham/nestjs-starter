import { validateSync } from 'class-validator';
import { PaginationParams } from '.';
import { plainToClass } from 'class-transformer';

test('PaginationParams validation', () => {
  const params = new PaginationParams();
  params.searchTerm = 'test';
  params.pageNumber = 2;
  params.pageSize = 20;
  params.attributes = 'id,name';
  params.order = '-updatedAt,name';
  params.filters = {
    email: {
      eq: 'abc@gmail.com'
    }
  };

  let errors = validateSync(params);
  expect(errors.length).toBe(0);

  params.pageNumber = 0;
  params.pageSize = 5;
  errors = validateSync(params);
  expect(errors.length).toBe(2);
  expect(errors[0].constraints).toHaveProperty('min');
  expect(errors[1].constraints).toHaveProperty('min');

  params.pageNumber = 1;
  params.pageSize = 200;
  errors = validateSync(params);
  expect(errors.length).toBe(1);
  expect(errors[0].constraints).toHaveProperty('max');

  params.order = 'invalid-order';
  errors = validateSync(params);
  expect(errors.length).toBe(1);
  expect(errors[0].constraints).toEqual({
    max: 'pageSize must not be greater than 100'
  });

  params.filters = {
    email: {
      invalidOperator: 'abc@gmail.com'
    }
  };
  errors = validateSync(params);
  expect(errors.length).toBe(1);
  expect(errors[0].constraints).toEqual({
    max: 'pageSize must not be greater than 100'
  });

  const filter = new PaginationParams();
  // filter.searchTerm = 0;
  expect(params.searchTerm).toBe('test');
});

test('PaginationParams class-transformer', () => {
  const data = {
    searchTerm: 123,
    pageNumber: '1',
    pageSize: '1',
    attributes: '',
    order: 'order',
    filters: '[a][b]=1'
  };

  const result = plainToClass(PaginationParams, data);
  expect(result.searchTerm).toEqual('123');
  expect(result.pageNumber).toEqual(1);
  expect(result.filters).toMatchObject({
    a: { b: '1' }
  });
});

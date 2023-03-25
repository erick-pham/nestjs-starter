import { Request, Response } from 'express';
import { LoggerMiddleware } from './logger.middleware';

test('LoggerMiddleware should set requestId header and log request information', () => {
  const mockRequest = {
    ip: '127.0.0.1',
    method: 'GET',
    path: '/test',
    originalUrl: '/test',
    get: jest.fn().mockReturnValue(''),
    headers: {}
  } as unknown as Request;

  const mockResponse = {
    setHeader: jest.fn(),
    get: jest.fn().mockReturnValue(''),
    on: jest.fn()
  } as unknown as Response;
  const mockNextFunction = jest.fn();

  const loggerMiddleware = new LoggerMiddleware();
  loggerMiddleware.use(mockRequest, mockResponse, mockNextFunction);

  expect(mockRequest.headers['requestId']).toBeDefined();
  expect(mockResponse.setHeader).toHaveBeenCalledWith(
    'requestId',
    mockRequest.headers['requestId']
  );
  expect(mockResponse.on).toHaveBeenCalledWith('close', expect.any(Function));

  expect(mockResponse.get('content-length')).toEqual('');
});

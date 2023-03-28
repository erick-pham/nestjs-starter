import {
  HttpException,
  HttpStatus,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpErrorFilter } from './http-error-filter';

describe('HttpErrorFilter', () => {
  let filter: HttpErrorFilter;

  beforeEach(() => {
    filter = new HttpErrorFilter();
  });

  it('should return 400 Bad Request for any error', () => {
    // Arrange
    const error = new Error('Test error');
    const request = {} as Request;
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      getHeader: jest.fn().mockReturnValue('test-Request-Id')
    } as unknown as Response;
    const host = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response
      })
    } as ArgumentsHost;

    // Act
    filter.catch(error, host);

    // Assert
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
      method: request.method,
      path: request.url,
      timestamp: expect.any(String),
      message: 'Test error'
    });
  });

  it('should handle HttpException and return its status code', () => {
    // Arrange
    const error = new HttpException('Test error', HttpStatus.NOT_FOUND);
    const request = {} as Request;
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      getHeader: jest.fn().mockReturnValue('test-Request-Id')
    } as unknown as Response;
    const host = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response
      })
    } as ArgumentsHost;

    const currentDate = new Date('2023-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);

    // Act
    filter.catch(error, host);

    // Assert
    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      statusCode: HttpStatus.NOT_FOUND,
      method: request.method,
      path: request.url,
      timestamp: new Date('2023-01-01').toISOString(),
      message: 'Test error'
    });
  });

  it('should handle HttpException with custom response and return its status code', () => {
    // Arrange
    const error = new HttpException(
      { message: 'Test error', errorCode: '123' },
      HttpStatus.UNAUTHORIZED
    );
    const request = {} as Request;
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      getHeader: jest.fn().mockReturnValue('test-Request-Id')
    } as unknown as Response;
    const host = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response
      })
    } as ArgumentsHost;

    const currentDate = new Date('2023-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);

    // Act
    filter.catch(error, host);

    // Assert
    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Bad Request',
      statusCode: HttpStatus.UNAUTHORIZED,
      method: request.method,
      path: request.url,
      timestamp: new Date('2023-01-01').toISOString(),
      message: 'Test error',
      errorCode: '123'
    });
  });

  it('should log internal server error if status code is >=500', () => {
    // Arrange
    const error = new HttpException(
      'Test error',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    const request = {} as Request;
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      getHeader: jest.fn().mockReturnValue('test-Request-Id')
    } as unknown as Response;
    const host = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response
      })
    } as ArgumentsHost;

    const currentDate = new Date('2023-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);
    jest.spyOn(Logger, 'error').mockImplementation();
    // Act
    filter.catch(error, host);

    // Assert
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  });
});

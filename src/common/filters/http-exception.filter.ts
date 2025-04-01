import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    let objError: object = { statusCode: 500, message: 'Server error' };
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      objError =
        typeof response === 'object'
          ? response
          : { statusCode: status, message: exception.message };
    } else {
      objError = { statusCode: status, message: exception.message };
    }

    res.status(status).json(objError);
  }
}

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { map, firstValueFrom, catchError } from 'rxjs';

interface IMSALUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export default class MSALServices {
  private readonly logger = new Logger(MSALServices.name);
  constructor(private http: HttpService) {}

  logError(error: AxiosError) {
    this.logger.error(error.message, {
      data: error.config?.data,
      headers: error.config?.headers,
      url: error.config?.url
    });
  }

  async getUserInfo(accessToken: string): Promise<IMSALUser> {
    const msalUser = await firstValueFrom(
      this.http
        .get('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })
        .pipe(
          map((res) => {
            return res?.data;
          })
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logError(error);
            throw new HttpException(
              'API not available',
              HttpStatus.BAD_REQUEST
            );
          })
        )
    );

    const result = {
      email: msalUser.mail,
      id: msalUser.id,
      name: msalUser.displayName,
      lastName: msalUser.surname,
      firstName: msalUser.givenName
    };
    return result;
  }
}

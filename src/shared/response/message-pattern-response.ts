export interface IBaseResponse {
  error?: boolean | false;
  status?: number | 200;
  errorCodes?: string[] | [];
  errorMessages?: string[] | [];
}

export default class MessagePatternResponse {
  private status = 200;
  private errorCodes = [];
  private errorMessages = [];

  setStatus(status: number) {
    this.status = status;
    return this;
  }

  sendSuccess<T>(msg?: any) {
    return {
      error: false,
      status: this.status,
      data: msg || 'Success'
    } as T;
  }

  sendErrors<T>(errors: string[]) {
    return {
      error: true,
      status: this.status,
      errorMessages: errors
    } as T;
  }

  send<T>(data: any) {
    return {
      error: false,
      status: this.status,
      data: data
    } as T;
  }
}

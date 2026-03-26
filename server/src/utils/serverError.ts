import { HttpStatus } from "http-status";

export interface ErrorType {
  message: string;
  status: HttpStatus | number;
}

class ServerError extends Error {
  public status: HttpStatus | number;
  constructor({ message, status }: ErrorType) {
    super(message);
    this.status = status;
    this.name = "ServerError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ServerError;

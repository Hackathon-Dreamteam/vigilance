import axios, { AxiosError } from 'axios';
import { HttpMiddleware } from './http-service';

export const errorHandlingMiddleware: HttpMiddleware = async (req, res, next) => {
  try {
    await next();
  } catch (error: unknown) {
    res.success = false;

    if (error instanceof AxiosError) {
      res.error = error;
      res.status = error.response?.status;
      res.statusText = error.response?.statusText;
    }

    if (req.options?.throwError && !axios.isCancel(error)) {
      throw error;
    }
  }
};

import axios, { AxiosError } from 'axios';
import { HttpMiddleware } from './http-service';
import { parseDates } from './http-utils';

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

export const parseDatesMiddleware: HttpMiddleware = async (_req, res, next) => {
  await next();

  if (res.success) {
    res.response = parseDates(res.response);
  }
};

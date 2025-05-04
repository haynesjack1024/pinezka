import {
  HttpEvent,
  HttpResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import _ from 'lodash';

export const snakeCaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const clonedRequest = req.clone({
      body: req.body ? convertKeysToSnakeCase(req.body) : req.body,
    });

    return next(clonedRequest).pipe(
      map((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          return event.clone({ body: convertKeysToCamelCase(event.body) });
        }

        return event;
      }),
    );
  }

  return next(req);
};

const convertKeysToSnakeCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        _.snakeCase(key),
        convertKeysToSnakeCase(value),
      ]),
    );
  }

  return obj;
};

const convertKeysToCamelCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        _.camelCase(key),
        convertKeysToCamelCase(value),
      ]),
    );
  }

  return obj;
};

import { HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method == 'POST' && req.url.startsWith('/api')) {
    const cookieService = inject(CookieService);

    return next(
      req.clone({
        headers: req.headers.set('X-CSRFToken', cookieService.get('csrftoken')),
      }),
    );
  }

  return next(req);
};

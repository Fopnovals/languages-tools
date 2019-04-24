import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from "./auth.service";
import urlJoin from 'url-join';
import {ENV} from "@app/env";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const deviceToken = localStorage.getItem('device_token') || '';

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`,
        DeviceToken: deviceToken
      },
      url: urlJoin(ENV.apiUrl, request.url)
      // url: urlJoin('https://api-v3-staging-dot-easyscat-driver-api.appspot.com/', request.url)
      // url: urlJoin('http://localhost:1337/', request.url)
    });

    return next.handle(request);
  }
}

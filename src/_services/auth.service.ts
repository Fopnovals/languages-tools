import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import * as endpoints from '../_shared/constants/endpoints'
import {UserService} from "./user.service";

@Injectable()
export class AuthService {

  private requestInterceptedSource: Subject<any> = new Subject<any>();
  public requestIntercepted: Observable<any> = this.requestInterceptedSource.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  getInterceptedSource(): Subject<any> {
    return this.requestInterceptedSource;
  }

  registration(user) {
    return new Promise((resolve, reject) => {
      this.http.post(endpoints.registrationUser, user)
        .subscribe((response: any) => {
          if(response.user && response.user.email === user.email) {
            this.login(user)
              .then(() => {
                resolve();
              })
              .catch(err => reject(err))
          }
        }, err => {
          reject(err);
        })
    });
  }

  login(user) {
    return new Promise((resolve, reject) => {
      this.http.post(endpoints.login, user)
        .subscribe((response: any) => {
          this.setToken(response.token);
          this.userService.setUser(response.user)
          resolve()
        }, err => {
          console.log(err);
          reject();
        })
    })
  }

  logout() {
    // this.globalStore.clean();
    this.http.post('logout', {}).subscribe(
      () => {
        sessionStorage.removeItem('accessToken');
      },
      err => {
        console.log(err);
      }
    )
  }

  getUserNameByEmail(data) {
    return this.http.post('know-user', { email: data.identifier });
  }

  setToken(accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  }

  getToken() {
    return sessionStorage.getItem('accessToken');
  }

}

import {Action} from "@ngrx/store";
import {UserModel} from "../../../_models/user.model";
import {HttpClient} from "@angular/common/http";
import * as endpoints from "../../../_shared/constants/endpoints"

export const userActions = {
  SET_USER: 'SET_USER'
};

export class SetUserAction implements Action {
  type = userActions.SET_USER;

  constructor(public payload: UserModel) { }
}

export class GetUserAction implements Action {
  type = userActions.SET_USER;

  constructor(private http: HttpClient) {
    this.getUser();
  }

  getUser() {
    this.http.get(endpoints.getUser)
      .subscribe((response) => {
        console.log(response);
      }, (err) => {
        console.log(err);
      });
  }
}

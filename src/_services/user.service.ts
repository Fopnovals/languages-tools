import {Storage} from "@ionic/storage";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import * as fromRoot from "../_shared/redux/reducers";
import {UserModel} from "../_models/user.model";
import {Observable} from "rxjs/Observable";
import {SetUserAction} from "../_shared/redux/actions/user.actions";

@Injectable()
export class UserService {

  constructor(
    private storage: Storage,
    private store: Store<fromRoot.State>
  ) {}

  setUser(user) {
    this.storage.set('user', user);
    this.store.dispatch(new SetUserAction(user));
  }

  getUser() {

  }

}

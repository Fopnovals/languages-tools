import {Action} from "@ngrx/store";
import {UserModel} from "../../../_models/user.model";

export const userActions = {
  SET_USER: 'SET_USER'
};

export class SetUserAction implements Action {
  type = userActions.SET_USER;

  constructor(public payload: UserModel) { }
}

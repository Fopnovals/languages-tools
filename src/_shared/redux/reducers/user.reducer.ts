import {UserModel} from "../../../_models/user.model";
import {userActions} from "../actions/user.actions";

export const INITIAL_STATE: UserModel = new UserModel();

export function userReducer(state = INITIAL_STATE, action: any) {

  switch (action.type) {
    case userActions.SET_USER:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}

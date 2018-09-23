import * as modules from './modules.reducer';
import * as fabStates from './fabstates.reducer';
import * as user from './user.reducer';
import {UserModel} from "../../../_models/user.model";


export interface State {
  modules: modules.ModulesState,
  fabStates: fabStates.FabState,
  user: UserModel
}

export const reducers = {
  modules: modules.modulesReducer,
  fabStates: fabStates.fabStatesReducer,
  user: user.userReducer
};

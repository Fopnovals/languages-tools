import {ModulesActions} from "../actions/modules.actions";
import {ModuleModel} from "../../../_models/others.model";

export interface  ModulesState {
  modules: ModuleModel[]
}

export const INITIAL_STATE: ModulesState = {
  modules: []
};

export function modulesReducer(state = INITIAL_STATE, action: any) {

  switch (action.type) {
    case ModulesActions.SET_MODULES:
      return Object.assign({}, state, {modules: action['payload']});

    default:
      return state;
  }
}

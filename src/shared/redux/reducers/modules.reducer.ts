import {ModulesActions} from "../actions/modules.actions";

export interface  ModulesState {
  modulesNames: Array<string>
}

export const INITIAL_STATE: ModulesState = {
  modulesNames: []
};

export function modulesReducer(state = INITIAL_STATE, action: any) {

  switch (action.type) {
    case ModulesActions.SET_MODULES_NAMES:
      return Object.assign({}, state, {modulesNames: action['payload']});

    default:
      return state;
  }
}

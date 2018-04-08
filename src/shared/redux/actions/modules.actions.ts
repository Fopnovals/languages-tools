import {Action} from "@ngrx/store";

export const ModulesActions = {
  SET_MODULES_NAMES: 'SET_MODULES_NAMES'
};

export class SetModulesNamesAction implements Action {
  type = ModulesActions.SET_MODULES_NAMES;

  constructor(public payload: any) { }
}

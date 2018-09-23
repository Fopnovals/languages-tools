import {Action} from "@ngrx/store";

export const ModulesActions = {
  SET_MODULES: 'SET_MODULES'
};

export class SetModulesNamesAction implements Action {
  type = ModulesActions.SET_MODULES;

  constructor(public payload: any) { }
}

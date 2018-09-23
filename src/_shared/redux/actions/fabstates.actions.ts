import {Action} from "@ngrx/store";

export const FabStatesActions = {
  SET_ADD_WORDS_FAB_STATE: 'SET_ADD_WORDS_FAB_STATE'
};

export class SetAddWordsFabStateAction implements Action {
  type = FabStatesActions.SET_ADD_WORDS_FAB_STATE;

  constructor(public payload: any) { }
}

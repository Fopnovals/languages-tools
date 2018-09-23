import {FabStatesActions} from "../actions/fabstates.actions";

export interface  FabState {
  displayAddWordsFab: boolean
}

export const INITIAL_STATE: FabState = {
  displayAddWordsFab: true
};

export function fabStatesReducer(state = INITIAL_STATE, action: any) {

  switch (action.type) {
    case FabStatesActions.SET_ADD_WORDS_FAB_STATE:
      console.log('SET_ADD_WORDS_FAB_STATE');
      console.log(state);
      console.log(action['payload']);
      return Object.assign({}, state, {displayAddWordsFab: action['payload']});

    default:
      return state;
  }
}

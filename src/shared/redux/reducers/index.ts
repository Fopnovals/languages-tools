import * as modules from './modules.reducer';
import * as fabStates from './fabstates.reducer';

export interface State {
  modules: modules.ModulesState,
  fabStates: fabStates.FabState
}

export const reducers = {
  modules: modules.modulesReducer,
  fabStates: fabStates.fabStatesReducer
};

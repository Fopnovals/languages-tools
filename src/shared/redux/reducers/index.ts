import * as modules from './modules.reducer';

export interface State {
  modules: modules.ModulesState
}

export const reducers = {
  modules: modules.modulesReducer
};

import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import * as words from '../../_shared/constants/suggested.words';
import * as constants from '../../_shared/constants/constants';
import {ModuleModel} from "../../_models/others.model";
import {Observable} from "rxjs/Observable";
import * as fromRoot from "../../_shared/redux/reducers";
import {Store} from "@ngrx/store";
import {TestWordsService} from "../../_services/test.words.service";
import {UserModel} from "../../_models/user.model";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public doughnutChartColors = constants.doughnutChartColors;
  public doughnutChartOptions = constants.doughnutChartOptions;
  data: [1, 17];
  private suggestedModules = [];
  public modules: ModuleModel[] = [];
  private modules$: Observable<any>;
  public allSuggestedModulesSelectedFlag = false;
  public hasSelectedSuggestedModulesFlag = false;
  public user: UserModel = new UserModel();
  private user$: Observable<any>;

  constructor(
    public navCtrl: NavController,
    private testWordsService: TestWordsService,
    private store: Store<fromRoot.State>
  ) {
    this.initSuggestedModel();

    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if (data && data.modules) {
        this.modules = data.modules;
      }
    });

    this.user$ = this.store.select('user');
    this.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  initSuggestedModel() {
    let module: ModuleModel = new ModuleModel();
    let modulesNames = [];

    words.suggestedWords.forEach((word) => {
      if(modulesNames.indexOf(word.moduleName) === -1) {
        modulesNames.push(word.moduleName);
        module = new ModuleModel();
        module.wordsCounter++;
        module.moduleCreated = new Date().toUTCString();
        module.selected = false;
        module.name = word.moduleName;
        this.suggestedModules.push(module);
      } else {
        let index = modulesNames.indexOf(word.moduleName);
        this.suggestedModules[index].wordsCounter++;
      }
    });
  }

  checkIfHasSelectedSuggestedModules() {
    let hasSelectedSuggestedModulesFlag = false;
    this.suggestedModules.forEach((module) => {
      if (module.selected) {
        hasSelectedSuggestedModulesFlag = true;
      }
    });

    this.hasSelectedSuggestedModulesFlag = hasSelectedSuggestedModulesFlag;
    if (!this.hasSelectedSuggestedModulesFlag) {
      this.allSuggestedModulesSelectedFlag = false;
    }
  }

  selectAllSuggestedModules() {
    this.suggestedModules.forEach((module) => {
      module['selected'] = this.allSuggestedModulesSelectedFlag;
      this.hasSelectedSuggestedModulesFlag = module.selected;
    });
  }

  addSuggested() {
    if(!this.hasSelectedSuggestedModulesFlag) {
      return this.navCtrl.setRoot('MyModulesPage');
    }

    let wordsArray = [];
    this.suggestedModules.forEach((module: ModuleModel) => {
      if (module.selected) {
        let selectedWords = words.suggestedWords.filter((word) => {
          return word.moduleName === module.name;
        });
        wordsArray.push(...selectedWords);
      }
    });

    // this.sqlStorage.setWordsCollection(wordsArray)
    //   .then(() => {
    //     this.sqlStorage.getModules();
    //   })
    //   .catch(err => console.log(err));
  }

  goToMyModules() {
    this.navCtrl.setRoot('MyModulesPage');
  }

}

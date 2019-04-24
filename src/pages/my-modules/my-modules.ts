import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../_shared/redux/reducers';
import {ModuleModel} from "../../_models/others.model";
import * as words from "../../_shared/constants/suggested.words";
import {EditModulePage} from "../edit-module/edit-module";

@IonicPage()
@Component({
  selector: 'page-edit-module',
  templateUrl: 'my-modules.html',
})
export class MyModulesPage {

  public words = [];
  public module: ModuleModel;
  public modules = [];
  private modules$: Observable<any>;
  private suggestedModules = [];
  public allSuggestedModulesSelectedFlag = false;
  public hasSelectedSuggestedModulesFlag = false;

  constructor(
    public navCtrl: NavController,
    private store: Store<fromRoot.State>,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public navParams: NavParams
  ) {
    this.initSuggestedModel();

    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if (data && data.modules) {
        this.modules = data.modules;
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

  deleteWord(row) {
    let associateRow = this.words.filter((el) => {
      return row.translateWordId === el.id;
    })[0];
    let params = {
      text: 'Are you shure you want to remove words ' + row.word + ' and ' + associateRow.word + '?'
    };
    let modal = this.modalCtrl.create('ModalSimpleComponent', params);
    modal.onDidDismiss(data => {
      if (data && data.accept) {
        this.deletePair(row.id, associateRow.id);
      }
    });
    modal.present();
  }

  deletePair(firstId, secondId) {
    for (let i = 0; i < this.words.length; i++) {
      if (firstId === this.words[i].id || secondId === this.words[i].id) {
        this.words.splice(i, 1);
        i--;
      }
    }

    // this.sqlStorage.removeWord(firstId).then((r) => {
    //   console.log(r);
    // }, err => {
    //   console.log(err);
    // })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    //
    // this.sqlStorage.removeWord(secondId).then((r) => {
    //   console.log(r);
    // }, err => {
    //   console.log(err);
    // })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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

  goToModule(module) {
    if(!module.wordsCounter) {
      this.navCtrl.push('EditModulePage',
        {module: module});
      return;
    }
    this.navCtrl.push('ModulePage',
      {module: module});
  }

  addModule() {
    let alert = this.alertCtrl.create({
      title: 'Create module',
      subTitle: 'Please type the module name',
      inputs: [
        {
          name: 'moduleName',
          placeholder: 'Module name',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.saveNewModule(data)
          }
        }
      ]
    });
    alert.present();
  }

  saveNewModule(data) {
    let module: ModuleModel = {
      wordsCounter: 0,
      name: data.moduleName,
      moduleCreated: new Date().toUTCString()
    };

    this.modules.unshift(module);
  }
}

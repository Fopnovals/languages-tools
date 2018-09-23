import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {ModuleModel} from "../../_models/others.model";
import {RowDbModel} from "../../_models/row.db.model";
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import * as fromRoot from "../../_shared/redux/reducers";
import {SetModulesNamesAction} from "../../_shared/redux/actions/modules.actions";

@IonicPage()
@Component({
  selector: 'page-edit-module',
  templateUrl: 'edit-module.html',
})
export class EditModulePage {

  private module: ModuleModel = null;
  public words: RowDbModel[] = [];
  public modules = [];
  private modules$: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<fromRoot.State>,
    private sqlStorage: SqlStorageProvider,
    private modalCtrl: ModalController
  ) {
    this.module = this.navParams.get('module');
    this.words = this.navParams.get('words') || [];
    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if (data && data.modules) {
        this.modules = data.modules;
      }
    });
  }

  add() {
    let modal = this.modalCtrl.create('AddWordsComponent',
      {module: this.module});
    modal.onDidDismiss(data => {
      if(data && data.row) {
        this.words.unshift(data.row);
        this.changeWordsCounterInModules('increment');
      }
    });
    modal.present();
  }

  changeWordsCounterInModules(action) {
    this.modules.forEach((module) => {
      if(module.name === this.module.name) {
        if(action ==='increment') {
          module.wordsCounter++;
        } else {
          module.wordsCounter--;
        }
      }
    });

    this.store.dispatch(new SetModulesNamesAction(this.modules));
  }

  deletePair(index) {
    if(this.words[index]['id']) {
      this.sqlStorage.removeWord(this.words[index]['id']);
    }
    this.words.splice(index, 1);
    this.changeWordsCounterInModules('decrement');
  }

}

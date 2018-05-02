import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../shared/redux/reducers';

@IonicPage()
@Component({
  selector: 'page-edit-module',
  templateUrl: 'edit-module.html',
})
export class EditModulePage {

  public words = [];
  public moduleName = '';
  public modules = [];
  private modules$: Observable<any>;

  constructor(public navCtrl: NavController,
              private sqlStorage: SqlStorageProvider,
              private store: Store<fromRoot.State>,
              private modalCtrl: ModalController,
              public navParams: NavParams) {
    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if (data && data.modulesNames) {
        this.modules = data.modulesNames;
      }
    });
  }

  getWordsByModuleName() {
    this.sqlStorage.getModule(this.moduleName)
      .then((res) => {
        this.words = res;
      }, (err) => {
        console.log(err);
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

    this.sqlStorage.remove(firstId).then((r) => {
      console.log(r);
    }, err => {
      console.log(err);
    })
      .catch((err) => {
        console.log(err);
      });

    this.sqlStorage.remove(secondId).then((r) => {
      console.log(r);
    }, err => {
      console.log(err);
    })
      .catch((err) => {
        console.log(err);
      });
  }

  editWord(id) {

  }
}

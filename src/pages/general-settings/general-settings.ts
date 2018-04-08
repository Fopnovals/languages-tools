import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";

@IonicPage()
@Component({
  selector: 'page-general-settings',
  templateUrl: 'general-settings.html',
})
export class GeneralSettingsPage {

  constructor(public navCtrl: NavController,
              private sqlStorage: SqlStorageProvider,
              private modalCtrl: ModalController,
              public navParams: NavParams) {
  }

  deleteDatabase() {
    let modal = this.modalCtrl.create('ModalSimpleComponent');
    modal.onDidDismiss(data => {
      if(data && data.accept) {
        this.sqlStorage.deleteDatabase();
      }
    });
    modal.present();
  }

}

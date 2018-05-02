import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {GeneralSettingsModel} from "../../_models/settings.model";
import {SharedService} from "../../_services/shared.service";

@IonicPage()
@Component({
  selector: 'page-general-settings',
  templateUrl: 'general-settings.html',
})
export class GeneralSettingsPage {

  public settings: GeneralSettingsModel;
  constructor(public navCtrl: NavController,
              private sqlStorage: SqlStorageProvider,
              private modalCtrl: ModalController,
              private sharedService: SharedService,
              public navParams: NavParams) {
    this.settings = new GeneralSettingsModel();
    this.sharedService.getCanSleepState()
      .then((res) => {
        this.settings.canSleep = res;
      });
  }

  changeSleepAllowing() {
    this.sharedService.allowSleep(this.settings.canSleep);
  }

  deleteDatabase() {
    let params = {
      text: 'Are you shure you want to remove the DATABASE?'
    };
    let modal = this.modalCtrl.create('ModalSimpleComponent', params);
    modal.onDidDismiss(data => {
      if(data && data.accept) {
        this.sqlStorage.deleteDatabase();
      }
    });
    modal.present();
  }

}

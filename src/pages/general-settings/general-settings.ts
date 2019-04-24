import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {GeneralSettingsModel} from "../../_models/settings.model";
import {SharedService} from "../../_services/shared.service";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-general-settings',
  templateUrl: 'general-settings.html',
})
export class GeneralSettingsPage {

  public settings: GeneralSettingsModel;
  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private sharedService: SharedService,
              private storage: Storage,
              public navParams: NavParams) {
    this.settings = new GeneralSettingsModel();
    this.storage.get('canSleep').then((res) => {
      if (res == undefined) {
        this.settings.canSleep = false;
        this.storage.set('canSleep', false);
      } else {
        this.settings.canSleep = res;
      }
    });
  }

  changeSleepAllowing() {
    this.storage.set('canSleep', this.settings.canSleep);
    this.sharedService.allowSleep(this.settings.canSleep);
  }

  deleteDatabase() {
    let params = {
      text: 'Are you shure you want to remove the DATABASE?'
    };
    let modal = this.modalCtrl.create('ModalSimpleComponent', params);
    modal.onDidDismiss(data => {
      if(data && data.accept) {
        // this.sqlStorage.deleteDatabase();
      }
    });
    modal.present();
  }

}

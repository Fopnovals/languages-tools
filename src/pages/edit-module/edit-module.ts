import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ModuleModel} from "../../_models/others.model";

@IonicPage()
@Component({
  selector: 'page-edit-module',
  templateUrl: 'edit-module.html',
})
export class EditModulePage {

  private module: ModuleModel = null;
  public words = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.module = this.navParams.get('module');
    this.words = this.navParams.get('words') || [];
  }


}

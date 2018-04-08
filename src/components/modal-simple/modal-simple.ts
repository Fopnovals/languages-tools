import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'modal-simple',
  templateUrl: 'modal-simple.html'
})
export class ModalSimpleComponent {

  public text = '';
  public hideAcceptButton = false;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.text = this.navParams.get('text');
    this.hideAcceptButton = this.navParams.get('hideAcceptButton');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  acceptAction() {
    this.viewCtrl.dismiss({accept: true});
  }

}

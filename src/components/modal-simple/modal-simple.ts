import { Component } from '@angular/core';
import {IonicPage, ViewController} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'modal-simple',
  templateUrl: 'modal-simple.html'
})
export class ModalSimpleComponent {

  constructor(private viewCtrl: ViewController) {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  acceptAction() {
    this.viewCtrl.dismiss({accept: true});
  }

}

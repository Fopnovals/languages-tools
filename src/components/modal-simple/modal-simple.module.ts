import {NgModule} from '@angular/core';
import {IonicPageModule} from "ionic-angular";
import {ModalSimpleComponent} from "./modal-simple";

@NgModule({
  declarations: [
    ModalSimpleComponent
  ],
  imports: [
    IonicPageModule.forChild(ModalSimpleComponent)
  ],
  exports: [
    ModalSimpleComponent
  ],
  providers: []
})
export class ModalSimpleModule {
}

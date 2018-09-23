import {NgModule} from '@angular/core';
import {IonicPageModule} from "ionic-angular";
import {AddWordsComponent} from "./add-words";

@NgModule({
  declarations: [
    AddWordsComponent
  ],
  imports: [
    IonicPageModule.forChild(AddWordsComponent)
  ],
  exports: [
    AddWordsComponent
  ],
  providers: []
})
export class AddWordsModule {
}

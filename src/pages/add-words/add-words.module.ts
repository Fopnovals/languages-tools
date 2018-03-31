import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddWordsPage } from './add-words';

@NgModule({
  declarations: [
    AddWordsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddWordsPage),
  ],
  exports: [
    AddWordsPage
  ]
})
export class AddWordsPageModule {}

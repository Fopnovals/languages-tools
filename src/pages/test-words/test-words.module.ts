import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestWordsPage } from './test-words';

@NgModule({
  declarations: [
    TestWordsPage,
  ],
  imports: [
    IonicPageModule.forChild(TestWordsPage),
  ],
})
export class TestWordsPageModule {}

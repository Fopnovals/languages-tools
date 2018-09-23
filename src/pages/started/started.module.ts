import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartedPage } from './started';

@NgModule({
  declarations: [
    StartedPage,
  ],
  imports: [
    IonicPageModule.forChild(StartedPage),
  ],
})
export class StartedPageModule {}

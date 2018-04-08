import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralSettingsPage } from './general-settings';

@NgModule({
  declarations: [
    GeneralSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneralSettingsPage),
  ],
})
export class GeneralSettingsPageModule {}

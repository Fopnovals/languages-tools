import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearningSettingsPage } from './learning-settings';

@NgModule({
  declarations: [
    LearningSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(LearningSettingsPage),
  ],
})
export class LearningSettingsPageModule {}

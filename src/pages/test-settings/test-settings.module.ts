import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestSettingsPage } from './test-settings';

@NgModule({
  declarations: [
    TestSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(TestSettingsPage),
  ],
})
export class TestSettingsPageModule {}

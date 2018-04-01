import {NgModule} from '@angular/core';
import {TestSettingsComponent} from "./test-settings";
import {IonicPageModule} from "ionic-angular";

@NgModule({
  declarations: [
    TestSettingsComponent
  ],
  imports: [
    IonicPageModule.forChild(TestSettingsComponent)
  ],
  exports: [
    TestSettingsComponent
  ],
  providers: []
})
export class TestSettingsModule {
}

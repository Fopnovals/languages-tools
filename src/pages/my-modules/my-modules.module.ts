import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyModulesPage } from './my-modules';

@NgModule({
  declarations: [
    MyModulesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyModulesPage),
  ],
})
export class EditModulePageModule {}

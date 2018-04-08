import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearningModePage } from './learning-mode';

@NgModule({
  declarations: [
    LearningModePage,
  ],
  imports: [
    IonicPageModule.forChild(LearningModePage),
  ],
})
export class LearningModePageModule {}

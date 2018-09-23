import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {Store} from "@ngrx/store";
import * as fromRoot from '../../_shared/redux/reducers';
import * as constants from "../../_shared/constants/constants";
import {Observable} from "rxjs/Observable";
import {LearningSettingsModel} from "../../_models/settings.model";
import {TestWordsService} from "../../_services/test.words.service";

@IonicPage()
@Component({
  selector: 'page-learning-settings',
  templateUrl: 'learning-settings.html',
})
export class LearningSettingsPage {

  @ViewChild(Navbar) navBar: Navbar;
  public languages = constants.languages;
  public modules = [];
  private modules$: Observable<any>;
  private learningSettings: LearningSettingsModel;

  constructor(public navCtrl: NavController,
              private store: Store<fromRoot.State>,
              private testWordsService: TestWordsService,
              public navParams: NavParams) {
    this.learningSettings = this.testWordsService.getLearningSettings();
    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if (data && data.modules) {
        this.modules = data.modules;
      }
    });
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.pop();
    }
  }

  saveSettings() {
    this.testWordsService.setLearningSettings(this.learningSettings);
    this.navCtrl.pop();
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.name === e2.name : e1 === e2;
  }
}

import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {TestWordsService} from "../../_services/test.words.service";
import * as constants from "../../shared/constants/constants";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../shared/redux/reducers';
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-test-settings',
  templateUrl: 'test-settings.html',
})
export class TestSettingsPage {

  public languages = constants.languages;
  public modules = [];
  private modules$: Observable<any>;
  public chooseNumbersOfWordsForTest = constants.chooseNumbersOfWordsForTest;
  private testSettings: any;

  constructor(private navCtrl: NavController,
              private store: Store<fromRoot.State>,
              private testWordsService: TestWordsService) {
    this.testSettings = this.testWordsService.getSettings();
    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if(data && data.modulesNames) {
        this.modules = data.modulesNames;
      }
    });
  }

  saveSettings() {
    this.testWordsService.setSettings(this.testSettings);
    if(this.navCtrl.getPrevious()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.name === e2.name : e1 === e2;
  }
}

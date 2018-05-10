import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController} from 'ionic-angular';
import {TestWordsService} from "../../_services/test.words.service";
import * as constants from "../../shared/constants/constants";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../shared/redux/reducers';
import {Observable} from "rxjs/Observable";
import {TestSettingsModel} from "../../_models/settings.model";

@IonicPage()
@Component({
  selector: 'page-test-settings',
  templateUrl: 'test-settings.html',
})
export class TestSettingsPage {

  @ViewChild(Navbar) navBar: Navbar;
  public languages = constants.languages;
  public modules = [];
  private modules$: Observable<any>;
  public chooseNumbersOfWordsForTest = constants.chooseNumbersOfWordsForTest;
  private testSettings: TestSettingsModel;

  constructor(private navCtrl: NavController,
              private store: Store<fromRoot.State>,
              private testWordsService: TestWordsService) {
    this.testSettings = this.testWordsService.getSettings();
    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if (data && data.modulesNames) {
        this.modules = data.modulesNames;
      }
    });
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.pop();
    }
  }

  saveSettings() {
    this.testWordsService.setSettings(this.testSettings);
    this.navCtrl.pop();
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.name === e2.name : e1 === e2;
  }
}

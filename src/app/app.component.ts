import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as constants from '../pages/pages';
import {SqlStorageProvider} from "../providers/sql-storage/sql-storage";
import {SharedService} from "../_services/shared.service";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import * as fromRoot from '../shared/redux/reducers';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
  public displayAddWordsFab = true;
  private displayAddWordsFab$: Observable<any>;
  public pages: Array<{ title: string, component: string }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              private store: Store<fromRoot.State>,
              private sqlStorage: SqlStorageProvider,
              private sharedService: SharedService,
              public splashScreen: SplashScreen) {
    this.initializeApp();
    this.pages = constants.pages;
    this.displayAddWordsFab$ = this.store.select('fabStates');
    this.displayAddWordsFab$.subscribe((state) => {
      console.log('FABSTATE');
      console.log(state);
      if(state.displayAddWordsFab != undefined) {
        this.displayAddWordsFab = state.displayAddWordsFab;
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.sharedService.defineCanSleep();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  goToPage(page) {
    this.nav.push(page);
  }
}

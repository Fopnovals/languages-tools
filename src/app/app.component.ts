import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as constants from '../pages/pages';
import {SqlStorageProvider} from "../providers/sql-storage/sql-storage";
import {SharedService} from "../_services/shared.service";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import * as fromRoot from '../_shared/redux/reducers';
import {AuthService} from "../_services/auth.service";
import {SetUserAction} from "../_shared/redux/actions/user.actions";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  public displayAddWordsFab = true;
  private displayAddWordsFab$: Observable<any>;
  public pages: Array<{ title: string, component: string }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              private store: Store<fromRoot.State>,
              private sqlStorage: SqlStorageProvider,
              private sharedService: SharedService,
              private authService: AuthService,
              public splashScreen: SplashScreen) {
    this.initializeApp();
    this.pages = constants.pages;
    this.displayAddWordsFab$ = this.store.select('fabStates');
    this.displayAddWordsFab$.subscribe((state) => {
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
      this.authService.isAutorized()
        .then((user) => {
          if(user) {
            this.store.dispatch(new SetUserAction(user));
            this.rootPage = 'HomePage';
          } else {
            this.rootPage = 'StartedPage';
            this.sharedService.changeFabAddWordsState(false);
          }
        })
        .catch((err) => {
          console.log(err);
          this.rootPage = 'StartedPage';
          this.sharedService.changeFabAddWordsState(false);
        })
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  goToPage(page) {
    this.nav.push(page);
  }
}

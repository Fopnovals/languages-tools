import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as constants from '../pages/pages';
import {SqlStorageProvider} from "../providers/sql-storage/sql-storage";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
  public pages: Array<{title: string, component: string}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              private sqlStorage: SqlStorageProvider,
              public splashScreen: SplashScreen) {
    this.initializeApp();
    this.pages = constants.pages;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  goToPage(page) {
    this.nav.push(page);
  }
}

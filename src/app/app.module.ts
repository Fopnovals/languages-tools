import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {SQLite} from "@ionic-native/sqlite";
import { SqlStorageProvider } from '../providers/sql-storage/sql-storage';
import {HttpClientModule} from "@angular/common/http";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {TranslateService} from "../_services/translate.service";
import {TestWordsService} from "../_services/test.words.service";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {reducers} from "../shared/redux/reducers";
import {SharedService} from "../_services/shared.service";
import {Insomnia} from "@ionic-native/insomnia";
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    StoreModule.forRoot(reducers),
    IonicStorageModule.forRoot(),
    StoreDevtoolsModule.instrument()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SpeechRecognition,
    SQLite,
    Insomnia,
    SqlStorageProvider,
    TranslateService,
    TestWordsService,
    SharedService,
    TextToSpeech,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

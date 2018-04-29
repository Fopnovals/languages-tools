import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {TranslateService} from "../../_services/translate.service";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../shared/redux/reducers';
import {Observable} from "rxjs/Observable";
import {TestWordsService} from "../../_services/test.words.service";

const recognitionOptions = {
  matches: 5
};

@IonicPage()
@Component({
  selector: 'page-add-words',
  templateUrl: 'add-words.html',
})
export class AddWordsPage {

  @ViewChild('firstTextarea') firstTextarea;
  @ViewChild('secondTextarea') secondTextarea;

  private recognitionOptions = recognitionOptions;
  public results1 = [];
  public results2 = [];
  public firstWord = '';
  public secondWord = '';
  public displayInput1 = false;
  public displayInput2 = false;
  public showInputNewModuleBox = false;
  public currentModuleName: string;
  public modules = [];
  private modules$: Observable<any>;

  constructor(public navCtrl: NavController,
              private sqlStorage: SqlStorageProvider,
              private translateService: TranslateService,
              private modalCtrl: ModalController,
              private wordsService: TestWordsService,
              private tts: TextToSpeech,
              private store: Store<fromRoot.State>,
              private speechRecognition: SpeechRecognition,
              public navParams: NavParams) {
    this.modules$ = this.store.select('modules');
    this.modules$.subscribe((data) => {
      if (data && data.modulesNames) {
        this.modules = data.modulesNames;
        if (this.modules.indexOf('Default') === -1) {
          this.modules.push('Default');
        }
        if(this.wordsService.getCurrentModuleName() === '') {
          this.wordsService.setCurrentModuleName('Default');
          this.currentModuleName = 'Default';
        } else {
          this.currentModuleName = this.wordsService.getCurrentModuleName();
        }
      }
    });
  }

  ionViewDidLoad() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(
              () => console.log('Granted'),
              () => console.log('Denied')
            )
        }
      });
  }

  startRecords(language) {
    this.recognitionOptions['language'] = language;
    console.log('-----------');
console.log(this.recognitionOptions);
    this.speechRecognition.startListening(recognitionOptions)
      .subscribe(
        (matches: Array<string>) => {
          this.setToResultVariable(language, matches);
        },
        (onerror) => {
          alert(onerror);
        }
      );
  }

  setToResultVariable(language, results) {
    switch (language) {
      case 'en-US' :
        this.results1 = results;
        if (results.length === 1) {
          this.firstWord = results[0];
          this.displayInput1 = true;
        } else {
          this.firstWord = '';
          this.displayInput1 = false;
        }
        break;

      case 'ru-RU' :
        this.results2 = results;
        if (results.length === 1) {
          this.secondWord = results[0];
          this.displayInput2 = true;
        } else {
          this.secondWord = '';
          this.displayInput2 = false;
        }
        break;
    }
  }

  playText(text, language) {
    this.tts.speak({
      text: text,
      rate: 1,
      locale: language
    })
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }

  setFocus(target) {
    this[target].nativeElement.focus();
  }

  googleTranslate(model, from, to) {
    let text = this[model];
    this.translateService.translate(text, from, to)
      .then((res: string) => {
        if (model === 'firstWord') {
          this.results2 = [];
          this.secondWord = res;
        } else {
          this.results1 = [];
          this.firstWord = res;
        }
      }, (err) => {
        console.log(err);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setToInput(value, target) {
    this[target] = value;
  }

  addModule() {
    this.showInputNewModuleBox = !this.showInputNewModuleBox;
    if (this.modules.indexOf(this.currentModuleName) !== -1) {
      let params = {
        hideAcceptButton: true,
        text: "You already have a module with some name. Please type an other name or add words to this module."
      };
      let modal = this.modalCtrl.create('ModalSimpleComponent', params);
      modal.present();
    } else {
      this.modules.push(this.currentModuleName);
    }
  }

  saveWords() {
    let first = {
        word: this.firstWord,
        language: 'en-US'
      },
      second = {
        word: this.secondWord,
        language: 'ru-RU'
      };
    this.wordsService.setCurrentModuleName(this.currentModuleName);
    this.sqlStorage.setACoupleWords(first, second, this.currentModuleName)
      .then((res) => {
        if (res) {
          this.firstWord = '';
          this.secondWord = '';
        }
      }, (err) => {
        console.log(err);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFromDB() {
    this.sqlStorage.getAll().then((data) => {
      console.log('tttttttttttt');
      console.dir(data);
    });
  }

}

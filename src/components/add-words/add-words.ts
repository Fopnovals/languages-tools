import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {TranslateService} from "../../_services/translate.service";
import {ModuleModel} from "../../_models/others.model";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {TestWordsService} from "../../_services/test.words.service";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {SharedService} from "../../_services/shared.service";
import * as fromRoot from "../../_shared/redux/reducers";
import {SpeechRecognition} from "@ionic-native/speech-recognition";

const recognitionOptions = {
  matches: 5
};

@IonicPage()
@Component({
  selector: 'add-words',
  templateUrl: 'add-words.html'
})
export class AddWordsComponent {

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
  public currentModule: ModuleModel;
  public modules = [];
  private modules$: Observable<any>;
  public module: ModuleModel = new ModuleModel();

  constructor(public navCtrl: NavController,
              private translateService: TranslateService,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private sharedService: SharedService,
              private wordsService: TestWordsService,
              private tts: TextToSpeech,
              private store: Store<fromRoot.State>,
              private speechRecognition: SpeechRecognition,
              public navParams: NavParams) {
    // this.modules$ = this.store.select('modules');
    // this.modules$.subscribe((data) => {
    //   if (data && data.modules) {
    //     this.modules = data.modules;
    //     this.currentModule = this.wordsService.getCurrentModule();
    //   }
    // });

    this.module = this.navParams.get('module');
    this.sharedService.changeFabAddWordsState(false);
    this.initSpeech();
  }

  initSpeech() {
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
    // this.showInputNewModuleBox = !this.showInputNewModuleBox;
    // if (this.modules.indexOf(this.currentModule) !== -1) {
    //   let params = {
    //     hideAcceptButton: true,
    //     text: "You already have a module with some name. Please type an other name or add words to this module."
    //   };
    //   let modal = this.modalCtrl.create('ModalSimpleComponent', params);
    //   modal.present();
    // } else {
    //   const newModule = {
    //     name: this.currentModule,
    //     moduleCreated: new Date()
    //   };
    //   this.modules.push(newModule);
    // }
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
    // this.wordsService.setCurrentModule(this.currentModule);
    // this.sqlStorage.setACoupleWords(first, second, this.module)
    //   .then((res) => {
    //     if (res) {
    //       this.viewCtrl.dismiss({row: res});
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.viewCtrl.dismiss();
    //   });
  }

  // getFromDB() {
  //   this.sqlStorage.getAll().then((data) => {
  //     console.log('tttttttttttt');
  //     console.log(data);
  //   });
  // }
  //
  // ionViewWillUnload() {
  //   console.log('ionViewWillUnload');
  //   this.sharedService.changeFabAddWordsState(true);
  // }

}

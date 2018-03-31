import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {TextToSpeech} from "@ionic-native/text-to-speech";

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

  constructor(public navCtrl: NavController,
              private sqlStorage: SqlStorageProvider,
              private tts: TextToSpeech,
              private speechRecognition: SpeechRecognition,
              public navParams: NavParams) {
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
        console.log();
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
    // this[target].setFocus();
  }

  translate() {
    console.log('TRANSLATE');
  }

  setToInput(value, target) {
    console.log(value);
    this[target] = value;
  }

  saveWords() {

  }

  getFromDB() {
    this.sqlStorage.getAll().then((data) => {
      console.log('tttttttttttt');
      console.dir(data);
    });
  }

}

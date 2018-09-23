import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ModuleModel} from "../../_models/others.model";
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {TextToSpeech} from "@ionic-native/text-to-speech";

@IonicPage()
@Component({
  selector: 'page-module',
  templateUrl: 'module.html',
})
export class ModulePage {

  private module: ModuleModel = null;
  public words = [];
  public play = false;
  private wordsForSpeak = [];
  private counter = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private tts: TextToSpeech,
    private sqlStorage: SqlStorageProvider,
  ) {
    this.module = this.navParams.get('module');
    if (this.module) {
      this.getWordsByModuleName();
    }
  }

  getWordsByModuleName() {
    this.sqlStorage.getModule(this.module.name)
      .then((res) => {
        this.words = res;
      }, (err) => {
        console.log(err);
      });
  }

  playRow(row) {
    this.deleteMarkFromWords();
    this.wordsForSpeak = [];
    this.wordsForSpeak.push({
      text: row.word,
      rate: 1,
      locale: row.language,
      id: row.id
    });
    this.wordsForSpeak.push({
      text: row.translateWord,
      rate: 1,
      locale: row.translateLanguage,
      id: row.id
    });

    if(this.play) {
      this.tts.speak('')
        .then(() => {
          this.play = false;
          this.speak();
        })
        .catch(err => console.log(err))
    } else {
      this.speak();
    }
  }

  playModule() {
    if(this.play) {
      this.tts.speak('');
      this.wordsForSpeak = [];
      return this.play = false;
    }

    this.wordsForSpeak = [];
    this.deleteMarkFromWords();
    this.words.forEach((row) => {
      this.wordsForSpeak.push({
        text: row.word,
        rate: 1,
        locale: row.language,
        id: row.id
      });
      this.wordsForSpeak.push({
        text: row.translateWord,
        rate: 1,
        locale: row.translateLanguage,
        id: row.id
      });
    });

    this.speak();
  }

  speak() {
    this.play = true;
    this.counter = 0;
    let that = this;
    goSpeak();

    function goSpeak() {
      if (that.counter < that.wordsForSpeak.length) {
        that.markWord(that.wordsForSpeak[that.counter]);
        that.tts.speak(that.wordsForSpeak[that.counter])
          .then(() => {
            that.counter++;
            goSpeak();
          }, (err) => {
            console.log(err);
          });
      } else {
        that.play = false;
      }
    }
  }

  markWord(item) {
    this.words.forEach((row) => {
      if(row.id === item.id) {
        row.speaked = true;
      }
    })
  }

  deleteMarkFromWords() {
    this.words.forEach((row) => {
        delete row.speaked;
    })
  }

  editModule() {
    this.navCtrl.push('EditModulePage',
      {
        module: this.module,
        words: this.words
      }
      );
  }

}

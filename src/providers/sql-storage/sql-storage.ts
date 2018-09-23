import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../_shared/redux/reducers';
import {SetModulesNamesAction} from "../../_shared/redux/actions/modules.actions";
import * as constants from '../../_shared/constants/constants';
import {ModuleModel} from "../../_models/others.model";

@Injectable()
export class SqlStorageProvider {
  storage: any;
  DB_NAME = 'wordsStorage';

  constructor(public http: HttpClient,
              private platform: Platform,
              private store: Store<fromRoot.State>,
              private sqLite: SQLite) {
    this.platform.ready().then(() => {
      this.sqLite.create({
        name: this.DB_NAME,
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.tryInit();
        });
    });
  }

  tryInit() {
    this.query('CREATE TABLE IF NOT EXISTS wordstable (id INTEGER PRIMARY KEY AUTOINCREMENT, word text, moduleName text, language text, translateLanguage text, translateWord text, repeatedCounter integer, rightAnswersCounter integer, wrongAnswersCounter integer, commandWordState integer, moduleCreated text)')
      .then(() => {
        this.getModules();
      })
      .catch(err => {
        alert('Unable to create initial storage tables' + err.tx + err.err);
      });
  }

  query(query: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.storage.transaction((tx: any) => {
            tx.executeSql(query, params,
              (tx: any, res: any) => {
                resolve({tx: tx, res: res});
              },
              (tx: any, err: any) => {
                reject({tx: tx, err: err});
                console.log(err);
              });
          },
          (err: any) => {
            reject({err: err});
            console.log(err);
          });
      } catch (err) {
        reject({err: err});
        console.log(err);
      }
    });
  }

  getWord(word) {
    let sql = ('SELECT * from wordstable where word="'+word+'"');
    return this.storage.executeSql(sql, {})
      .then(response => {
        return Promise.resolve(response.rows.item(0));
      })
      .catch(error => Promise.reject(error));
  }

  // getTranslateWordById(id) {
  //   let sql = ('SELECT * from wordstable where translateWordId="'+id+'"');
  //   return this.storage.executeSql(sql, {})
  //     .then(response => {
  //       return Promise.resolve(response.rows.item(0));
  //     })
  //     .catch(error => Promise.reject(error));
  // }

  getModule(module) {
    let sql = ('SELECT * FROM wordstable WHERE moduleName="'+module+'"');
    return this.storage.executeSql(sql, [])
      .then(response => {
        let allRows = [];
        for (let index = 0; index < response.rows.length; index++) {
          allRows.push(response.rows.item(index));
        }
        return Promise.resolve(allRows);
      })
      .catch(error => Promise.reject(error));
  }

  deleteDatabase() {
    this.sqLite.deleteDatabase({
      name: this.DB_NAME,
      location: 'default'
    }).then(() => {
      this.sqLite.create({
        name: this.DB_NAME,
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.tryInit();
        });
    })
      .catch(err => console.log(err))
  }

  getAll() {
    let sql = 'SELECT * FROM wordstable';
    return this.storage.executeSql(sql, [])
      .then(response => {
        let allRows = [];
        for (let index = 0; index < response.rows.length; index++) {
          allRows.push(response.rows.item(index));
        }
        return Promise.resolve(allRows);
      })
      .catch(error => Promise.reject(error));
  }

  getModules() {
    let sql = 'SELECT * FROM wordstable';
    let module: ModuleModel = new ModuleModel();
    let modulesNames = [];

    this.storage.executeSql(sql, 'moduleName')
      .then(response => {
        let modules = [];
        for (let index = 0; index < response.rows.length; index++) {
          if(modulesNames.indexOf(response.rows.item(index).moduleName) === -1) {
            modulesNames.push(response.rows.item(index).moduleName);
            module = new ModuleModel();
            module.wordsCounter++;
            module.moduleCreated = response.rows.item(index).moduleCreated;
            module.name = response.rows.item(index).moduleName;
            modules.push(module);
          } else {
            let i = modulesNames.indexOf(response.rows.item(index).moduleName);
            modules[i].wordsCounter++;
          }
        }
        this.store.dispatch(new SetModulesNamesAction(modules));
      })
      .catch((error) => {
        console.log('ERROR', error);
      });
  }

  searchTranslateLanguage(language) {
    if(language === 'en-US') {
      return constants.languages.filter((el) => {
        return el['middleName'] === 'ru-RU';
      })[0].middleName;
    } else {
      return constants.languages.filter((el) => {
        return el['middleName'] === 'en-US';
      })[0].middleName;
    }
  }

  setACoupleWords(first, second, module) {
    first['repeatedCounter'] = 0;
    first['moduleName'] = module.name;
    first['rightAnswersCounter'] = 0;
    first['wrongAnswersCounter'] = 0;
    first['commandWordState'] = 0;
    first['moduleCreated'] = module.moduleCreated;
    first['translateWord'] = second.word;
    first['translateLanguage'] = this.searchTranslateLanguage(first['language']);
    second['repeatedCounter'] = 0;
    second['moduleName'] = module.name;
    second['rightAnswersCounter'] = 0;
    second['wrongAnswersCounter'] = 0;
    second['commandWordState'] = 0;
    second['moduleCreated'] = module.moduleCreated;
    second['translateWord'] = first.word;
    second['translateLanguage'] = this.searchTranslateLanguage(second['language']);
    return new Promise((resolve, reject) => {
      this.set(first).then((res) => {
        this.set(second).then((res2) => {
          console.log('The pair of words have been written');
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        reject(err);
      })
    });
  }

  setWordsCollection(collection) {
    return new Promise((resolve, reject) => {
      let data = [];

      collection.forEach((row) => {
        let sql = 'INSERT INTO wordstable (word, moduleName, language, translateLanguage, translateWord, repeatedCounter, rightAnswersCounter, wrongAnswersCounter, commandWordState, moduleCreated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let word = [row['word'], row['moduleName'], row['language'], row['translateLanguage'], row['translateWord'], 0, 0, 0, 0, row['moduleCreated']];
        data.push([sql, word]);
      });

      let ooo = 'CREATE TABLE IF NOT EXISTS wordstable (word, moduleName, language, translateLanguage, translateWord, repeatedCounter, rightAnswersCounter, wrongAnswersCounter, commandWordState, moduleCreated)';

      this.storage.sqlBatch([ooo, ...data])
        .then((data) => {
          this.getModules();
        })
        .catch(err => console.log(err));
    });
  }

  set(data: any) {
    let sql = 'INSERT INTO wordstable (word, moduleName, language, translateLanguage, translateWord, repeatedCounter, rightAnswersCounter, wrongAnswersCounter, commandWordState, moduleCreated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    return this.storage.executeSql(sql, [data.word, data.moduleName, data.language, data.translateLanguage, data.translateWord, data.repeatedCounter, data.rightAnswersCounter, data.wrongAnswersCounter, data.commandWordState, data.moduleCreated]);
  }

  updateRowById(data: any) {
    let sql = 'UPDATE wordstable SET word=?, moduleName=?, language=?, translateLanguage=?, translateWord=?, repeatedCounter=?, rightAnswersCounter=?, wrongAnswersCounter=?, commandWordState=?, moduleCreated=? WHERE id=?';
    return this.storage.executeSql(sql, [data.word, data.moduleName, data.language, data.translateLanguage, data.translateWord, data.repeatedCounter, data.rightAnswersCounter, data.wrongAnswersCounter, data.commandWordState, data.moduleCreated, data.id]);
  }

  // updateTranslateWordId(data: any) {
  //   let sql = 'UPDATE wordstable SET translateWordId=? WHERE id=?';
  //   return this.storage.executeSql(sql, [data.translateWordId, data.id]);
  // }

  removeWord(id: number): Promise<any> {
    return this.query('DELETE FROM wordstable WHERE ID=?', [id]);
  }

}

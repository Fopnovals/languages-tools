import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../shared/redux/reducers';
import {SetModulesNamesAction} from "../../shared/redux/actions/modules.actions";
import * as constants from '../../shared/constants/constants';

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
    this.query('CREATE TABLE IF NOT EXISTS wordstable (id INTEGER PRIMARY KEY AUTOINCREMENT, word text, moduleName text, language text, translateLanguage text, translateWordId integer, repeatedCounter integer, rightAnswersCounter integer, wrongAnswersCounter integer, commandWordState integer)')
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
                console.log('resolve');
                console.log(res);
                console.log(tx);
              },
              (tx: any, err: any) => {
                reject({tx: tx, err: err});
                console.log('reject1');
                console.log(err);
              });
          },
          (err: any) => {
            reject({err: err});
            console.log('reject2');
            console.log(err);
          });
      } catch (err) {
        reject({err: err});
        console.log('reject3');
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

  getTranslateWordById(id) {
    let sql = ('SELECT * from wordstable where translateWordId="'+id+'"');
    return this.storage.executeSql(sql, {})
      .then(response => {
        return Promise.resolve(response.rows.item(0));
      })
      .catch(error => Promise.reject(error));
  }

  getModule(moduleName) {
    let sql = ('SELECT * FROM wordstable WHERE moduleName="'+moduleName+'"');
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
      this.tryInit();
    });
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
    this.storage.executeSql(sql, 'moduleName')
      .then(response => {
        let modules = [];
        for (let index = 0; index < response.rows.length; index++) {
          if(modules.indexOf(response.rows.item(index).moduleName) === -1)
          modules.push(response.rows.item(index).moduleName);
        }
        this.store.dispatch(new SetModulesNamesAction(modules));
      })
      .catch((error) => {
        console.log('ERROR');
        console.log(error);
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

  setACoupleWords(first, second, moduleName) {
    first['repeatedCounter'] = 0;
    first['moduleName'] = moduleName || 'Default';
    first['rightAnswersCounter'] = 0;
    first['wrongAnswersCounter'] = 0;
    first['commandWordState'] = 0;
    first['translateLanguage'] = this.searchTranslateLanguage(first['language']);
    second['repeatedCounter'] = 0;
    second['moduleName'] = moduleName || 'Default';
    second['rightAnswersCounter'] = 0;
    second['wrongAnswersCounter'] = 0;
    second['commandWordState'] = 0;
    second['translateLanguage'] = this.searchTranslateLanguage(second['language']);
    return new Promise((resolve, reject) => {
      this.set(first).then((res) => {
        second['translateWordId'] = res.insertId;
        this.set(second).then((res2) => {
          let updatedRow = {
            id: second['translateWordId'],
            translateWordId: res2.insertId
          };
          this.updateTranslateWordId(updatedRow).then(() => {
            resolve(true);
          }, (err) => {
            reject(err);
          });
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        reject(err);
      })
    });
  }

  set(data: any) {
    let sql = 'INSERT INTO wordstable (word, moduleName, language, translateLanguage, translateWordId, repeatedCounter, rightAnswersCounter, wrongAnswersCounter, commandWordState) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    return this.storage.executeSql(sql, [data.word, data.moduleName, data.language, data.translateLanguage, data.translateWordId, data.repeatedCounter, data.rightAnswersCounter, data.wrongAnswersCounter, data.commandWordState]);
  }

  updateRowById(data: any) {
    let sql = 'UPDATE wordstable SET word=?, moduleName=?, language=?, translateLanguage=?, translateWordId=?, repeatedCounter=?, rightAnswersCounter=?, wrongAnswersCounter=?, commandWordState=? WHERE id=?';
    return this.storage.executeSql(sql, [data.word, data.moduleName, data.language, data.translateLanguage, data.translateWordId, data.repeatedCounter, data.rightAnswersCounter, data.wrongAnswersCounter, data.commandWordState, data.id]);
  }

  updateTranslateWordId(data: any) {
    let sql = 'UPDATE wordstable SET translateWordId=? WHERE id=?';
    return this.storage.executeSql(sql, [data.translateWordId, data.id]);
  }

  remove(id: number): Promise<any> {
    return this.query('DELETE FROM wordstable WHERE ID=?', [id]);
  }

}

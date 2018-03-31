import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Platform} from "ionic-angular";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

const firstRecord = {
  names: [
    'word', 'language', 'associateId', 'repeatedCounter', 'rightAnswersCounter', 'wrongAnswersCounter', 'commandWordState'
  ],
  values: [
    'Spoon', 'en', 12, 5, 2, 3, 0
  ]
};

@Injectable()
export class SqlStorageProvider {
  storage: any;
  DB_NAME = 'wordsStorage';

  constructor(public http: HttpClient,
              private platform: Platform,
              private sqLite: SQLite) {
    this.platform.ready().then(() => {
      // this.sqLite.deleteDatabase({
      //   name: this.DB_NAME,
      //   location: 'default'
      // });
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
    this.query('CREATE TABLE IF NOT EXISTS wordstable (_id INTEGER PRIMARY KEY AUTOINCREMENT, word text, language text, associateId integer, repeatedCounter integer, rightAnswersCounter integer, wrongAnswersCounter integer, commandWordState integer)')
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
                resolve({ tx: tx, res: res })
                console.log('resolve');
                console.log(res);
                console.log(tx);
              },
              (tx: any, err: any) => {
                reject({ tx: tx, err: err })
                console.log('reject1');
                console.log(err);
              });
          },
          (err: any) => {
            reject({ err: err })
            console.log('reject2');
            console.log(err);
          });
      } catch (err) {
        reject({ err: err });
        console.log('reject3');
        console.log(err);
      }
    });
  }

  getAll(){
    let sql = 'SELECT * FROM wordstable';
    return this.storage.executeSql(sql, [])
      .then(response => {
        let allRows = [];
        for (let index = 0; index < response.rows.length; index++) {
          allRows.push( response.rows.item(index) );
        }
        return Promise.resolve( allRows );
      })
      .catch(error => Promise.reject(error));
  }

  setFirstly(): Promise<any> {
    let sql = 'INSERT INTO wordstable (word, language, associateId, repeatedCounter, rightAnswersCounter, wrongAnswersCounter, commandWordState) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return this.storage.executeSql(sql, ['Dog', 'en-US', 12, 5, 2, 3, 0]);
  }

  set(data: any){
    let sql = 'INSERT INTO wordstable (word, language, associateId, repeatedCounter, rightAnswersCounter, wrongAnswersCounter, commandWordState) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return this.storage.executeSql(sql, [data.word, data.language, data.associateId, data.repeatedCounter, data.rightAnswersCounter, data.wrongAnswersCounter, data.commandWordState]);
  }

  update(data: any){
    let sql = 'UPDATE wordstable SET word=?, language=?, associateId=?, repeatedCounter=?, rightAnswersCounter=?, wrongAnswersCounter?, commandWordState WHERE id=?';
    return this.storage.executeSql(sql, [data.word, data.associateId, data.repeatedCounter, data.rightAnswersCounter, data.wrongAnswersCounter, data.commandWordState, data.id]);
  }

  remove(id: number): Promise<any> {
    return this.query('DELETE FROM wordstable WHERE ID=?', [id]);
  }

}

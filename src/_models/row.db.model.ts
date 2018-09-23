export class RowDbModel {
  id?: number;
  word: string = '';
  language: string;
  translateWord: string = '';
  translateLanguage: string;
  moduleName: string;
  repeatedCounter: number;
  rightAnswersCounter: number;
  wrongAnswersCounter: number;
  commandWordState: number;
  moduleCreated: any;
}

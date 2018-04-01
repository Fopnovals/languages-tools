import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class TranslateService {
  constructor(private httpClient: HttpClient) {}

  translate(text, from, to) {
    let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
      + from + "&tl=" + to + "&dt=t&q=" + encodeURI(text);

    return new Promise((resolve, reject) => {
      this.httpClient.get(url).subscribe((res) => {
        resolve(res[0][0][0]);
      }, (err) => {
        reject(err);
      });
    })

  }
}

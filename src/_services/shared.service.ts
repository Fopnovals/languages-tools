import {Injectable} from "@angular/core";
import {Insomnia} from "@ionic-native/insomnia";
import {Storage} from "@ionic/storage";

@Injectable()
export class SharedService {

  private canSleep = false;

  constructor(private insomnia: Insomnia,
              private storage: Storage) {
    this.storage.get('canSleep').then((res) => {
      if(res || res === 'false') {
        this.canSleep = res;
      }
    });
  }

  getCanSleepState() {
    return this.storage.get('canSleep');
  }

  allowSleep(data?) {
    if(data || data === 'false') {
      this.storage.set('canSleep', data);
    } else {
      data = this.canSleep;
    }

    if(data) {
      this.insomnia.allowSleepAgain()
        .then(
          () => console.log('success'),
          () => console.log('error')
        );
    } else {
      this.insomnia.keepAwake()
        .then(
          () => console.log('success'),
          () => console.log('error')
        );
    }
  }
}

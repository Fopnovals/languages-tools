import {Injectable} from "@angular/core";
import {Insomnia} from "@ionic-native/insomnia";
import {Storage} from "@ionic/storage";
import {Store} from "@ngrx/store";
import * as fromRoot from '../shared/redux/reducers';
import {SetAddWordsFabStateAction} from "../shared/redux/actions/fabstates.actions";

@Injectable()
export class SharedService {

  constructor(private insomnia: Insomnia,
              private store: Store<fromRoot.State>,
              private storage: Storage) {
  }

  changeFabAddWordsState(newState) {
    this.store.dispatch(new SetAddWordsFabStateAction(newState));
  }

  defineCanSleep() {
    this.storage.get('canSleep').then((res) => {
      let canSleep;
      if (res == undefined) {
        canSleep = false;
        this.storage.set('canSleep', false);
      } else {
        canSleep = res;
      }
      this.allowSleep(canSleep);
    });
  }

  allowSleep(data) {
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

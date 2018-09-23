import {Storage} from "@ionic/storage";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthService {

  constructor(
    private storage: Storage
  ) {}

  isAutorized() {
    return this.storage.get('user');
  }

}

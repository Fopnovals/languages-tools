import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import * as slides from '../../_shared/constants/slides';
import {StartedSlidesModel} from "../../_models/slides.model";
import {UserModel} from "../../_models/user.model";
import {AuthService} from "../../_services/auth.service";
import {UserService} from "../../_services/user.service";

@IonicPage()
@Component({
  selector: 'page-started',
  templateUrl: 'started.html',
})
export class StartedPage {

  @ViewChild('slider') slider: Slides;
  public slides: StartedSlidesModel[] = slides.startedSlides;
  public showSkip = true;
  public user: UserModel = new UserModel();
  public loginMode = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private userService: UserService
  ) {}

  login() {
    this.authService.login(this.user)
      .then(() => {
        console.log('1111111');
      })
      .catch(err => err)
  }

  registration() {
    this.authService.registration(this.user)
      .then((data) => {
        console.log('1111111');
        console.log(data);
      })
      .catch(err => err)
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  goToLastSlide() {
    this.slider.slideTo(this.slides.length, 800);
  }

}

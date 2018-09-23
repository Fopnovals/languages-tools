import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import * as slides from '../../_shared/constants/slides';
import {StartedSlidesModel} from "../../_models/slides.model";
import {UserModel} from "../../_models/user.model";
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService
  ) {}

  startApp() {
    this.userService.setUser(this.user);
    this.navCtrl.setRoot('HomePage');
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  goToLastSlide() {
    this.slider.slideTo(this.slides.length, 800);
  }

}

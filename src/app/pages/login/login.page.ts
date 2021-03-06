import { Component} from '@angular/core';
import { NavController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  backButtonSubscription :any;
  status: boolean = false;
  password_type: string = 'password';
  password_icon: string = 'eye-off';

  constructor(
    private navController: NavController,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    private loadingController: LoadingController,
    private userService: UserServiceService
  ) { }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      mode: "ios",
      cssClass: "myspin"
    });
    return await loading.present();
  }

  togglePasswordMode() {   
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
    this.password_icon = this.password_icon === 'eye' ? 'eye-off' : 'eye';
  }

  ionViewWillEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10,() => {
      navigator["app"].exitApp();
    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }


  login(form) {
    if(form.value.email=="" || form.value.password =="") {
      this.status = true;
    }
    else {
      this.presentLoadingWithOptions();
      this.userService.login(form.value.email,form.value.password).subscribe( 
        userId => this.loginCheck(userId),
        error => console.log(error),
        () => this.loadingController.dismiss()
      );
    }  
  }

  loginCheck(userId){
    if(userId==0){
      this.status = true;
    }
    else{
      this.navController.navigateRoot('tabs/tab1');
      this.nativeStorage.setItem('userId',{user: userId}).then(
        () => console.log("data stored"),
        (error) => console.error(error)
      );
    }
  }

}

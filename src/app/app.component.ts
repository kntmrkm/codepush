import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CodePush } from '@ionic-native/code-push/ngx';
// CodePushのキー
const CODE_PUSH_IOS_KEY       = 'q6nkZz9g49p6AuS0o7_QWD1G-TAkBJDvChkpN';
const CODE_PUSH_ANDROID_KEY   = 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // 進捗を画面に表示するための変数
  log = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private codePush: CodePush
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('initializeApp');
    this.platform.ready().then(() => {
      this.init();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * CodePushのアップデート
   */
  private async checkAndUpdate() {
    this.putLog('CodePush.sync() 開始');

    const deploymentKey = this.getDeploymentKey();
    this.codePush.sync({
      deploymentKey: deploymentKey,
    }).subscribe(status => {
      this.putLog(`SyncStatus = ${status}`);
    }, error => {
      this.putLog(`Error = ${error}`);
    });
  }

  /**
   * Ionicアプリが準備できた段階で呼ばれる初期化処理
   */
  private init() {
    // アプリ再開を監視
    this.platform.resume.subscribe(() => {
      this.checkAndUpdate();
    });

    // アプリ起動時の同期
    this.checkAndUpdate();
  }

  /**
   * OSに応じたCodePushのキー
   * @return CodePushのキー
   */
  private getDeploymentKey(): string {
    if (this.platform.is('ios')) {
      return CODE_PUSH_IOS_KEY;
    } else if (this.platform.is('android')) {
      return CODE_PUSH_ANDROID_KEY;
    }

    throw new Error('Not supported platform.');
  }

  /**
   * OSに応じたCodePushのキー
   * @param body 出力するログ
   */
  private putLog(body: string) {
    this.log += `${body}<br>`;
  }
}

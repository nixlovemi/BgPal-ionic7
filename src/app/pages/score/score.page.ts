import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Score } from '../../classes/scoreList';
import { StorageService } from '../../services/storage.service';
import { DB_KEY_SCORES } from '../../classes/constants';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {
  scoreList: Array<Score> = [];

  constructor(
    private storage: StorageService,
    private navCtrl: NavController,
    private utilsSrv: UtilsService,
  ) { }

  async ngOnInit() {
    await this.addFakeScores();
  }

  async ionViewWillEnter() {
    await this.loadScores();
  }

  async addFakeScores() {
    // await this.addGameOne();
    // await this.addGameTwo();
  }

  async loadScores() {
    // for now
    this.scoreList = [];

    let json: Array<any> = await this.storage.get(DB_KEY_SCORES) ?? [];
    // console.log('score page: load scores: get json from storage', json);

    for (let i = 0; i < json.length; i++) {
      let FakeScore = new Score(this.storage);
      FakeScore.setTitle(json[i].title);
      FakeScore.setDate(json[i].date);

      // players
      for (let j = 0; j < json[i].players.length; j++) {
        FakeScore.addPlayer(json[i].players[j].name);
      }

      // columns
      for (let j = 0; j < json[i].columns.length; j++) {
        FakeScore.addColumn(json[i].columns[j].title);
      }

      // scores
      for (let j = 0; j < json[i].scores.length; j++) {
        FakeScore.addScore(json[i].scores[j].playerIdx, json[i].scores[j].columnIdx, json[i].scores[j].value);
      }

      // add to list to display
      this.scoreList.push(FakeScore);
    }
  }

  openScoreDetails(scoreIdx: number) {
    this.navCtrl.navigateForward('/score-details/' + scoreIdx);
  }

  openScoreAdd() {
    this.navCtrl.navigateForward('/score-add', {skipLocationChange: true});
  }

  deleteScoreList(index: number) {
    let title = this.scoreList[index].title ?? '';
    this.utilsSrv.showAlert(`Deletion of ${title}`, '', 'Are you sure? This action can\'t be undone.', [
      {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
      }, {
          text: 'Yes!',
          handler: () => {
            this.doDeleteScoreList(index);
          }
      }
    ]);
  }

  async doDeleteScoreList(index: number) {
    await this.utilsSrv.getLoader('Deleting...', 'bubbles');
    let FakeScore = new Score(this.storage);
      FakeScore.delete(index);
      setTimeout(() => {
        this.loadScores();
        this.utilsSrv.closeLoader();
      }, 200);
  }
}

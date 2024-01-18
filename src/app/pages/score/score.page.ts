import { Component, OnInit } from '@angular/core';
import { Score } from '../../classes/scoreList';
import { StorageService } from '../../services/storage.service';
import { DB_KEY_SCORES } from '../../classes/constants';
import { NavController } from '@ionic/angular';

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

  private async addGameOne() {
    let FakeScore = new Score(this.storage);
    FakeScore.setTitle('Seven Wonders');
    FakeScore.setDate('2023-01-13');

    // players
    FakeScore.addPlayer('Leandro'); // 0
    FakeScore.addPlayer('Carla'); // 1

    // columns
    FakeScore.addColumn('Coins'); // 0
    FakeScore.addColumn('Military'); // 1
    FakeScore.addColumn('Wonders'); // 2
    FakeScore.addColumn('Guilds'); // 3

    // points Le
    FakeScore.addScore(0, 0, 4);
    FakeScore.addScore(0, 1, 6);
    FakeScore.addScore(0, 2, 2);
    FakeScore.addScore(0, 3, 9);

    // points Carla
    FakeScore.addScore(1, 0, 5);
    FakeScore.addScore(1, 1, 10);
    FakeScore.addScore(1, 2, 3);
    FakeScore.addScore(1, 3, 11);

    // add to list to display
    // this.scoreList.push(FakeScore);
    FakeScore.save();
  }

  private async addGameTwo() {
    let FakeScore = new Score(this.storage);
    FakeScore.setTitle('Sushi GO');
    FakeScore.setDate('2023-01-14');

    // players
    FakeScore.addPlayer('Leandro'); // 0
    FakeScore.addPlayer('Carla'); // 1
    FakeScore.addPlayer('Bola'); // 2

    // columns
    FakeScore.addColumn('1 Round'); // 0
    FakeScore.addColumn('2 Round'); // 1
    FakeScore.addColumn('2 Round'); // 2

    // points Le
    FakeScore.addScore(0, 0, 10);
    FakeScore.addScore(0, 1, 11);
    FakeScore.addScore(0, 2, 12);

    // points Carla
    FakeScore.addScore(1, 0, 13);
    FakeScore.addScore(1, 1, 14);
    FakeScore.addScore(1, 2, 15);

    // points Bola
    FakeScore.addScore(2, 0, 16);
    FakeScore.addScore(2, 1, 17);
    FakeScore.addScore(2, 2, 18);

    // add to list to display
    // this.scoreList.push(FakeScore);
    FakeScore.save();
  }

  openScoreDetails(scoreIdx: number) {
    this.navCtrl.navigateForward('/score-details/' + scoreIdx);
  }

  openScoreAdd() {
    this.navCtrl.navigateForward('/score-add', {skipLocationChange: true});
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { DB_KEY_SCORES } from '../../classes/constants';
import { Score } from '../../classes/scoreList';

@Component({
  selector: 'app-score-details',
  templateUrl: './score-details.page.html',
  styleUrls: ['./score-details.page.scss'],
})
export class ScoreDetailsPage implements OnInit {
  private scoreIdx: number = -1;
  CurrentScore: Score = new Score(this.storage);
  playerInScoreOrder: Array<any> = [];
  byPlayer: boolean = true;
  byColumn: boolean = false;
  loaded: boolean = false;

  constructor(
    private actRoute: ActivatedRoute,
    private storage: StorageService,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.actRoute.params.subscribe((res) => {
      if ( typeof res['scoreIdx'] !== 'undefined' ) {
        this.scoreIdx = res['scoreIdx'];
      }
    });

    await this.loadScoreDetails();
    this.loaded = true;
  }

  private async loadScoreDetails() {
    // get score details from storage using scoreIdx
    let json: Array<any> = await this.storage.get(DB_KEY_SCORES) ?? [];
    let scoreDetails = json[this.scoreIdx];
    this.CurrentScore = new Score(this.storage);
    this.CurrentScore.setTitle(scoreDetails.title);
    this.CurrentScore.setDate(scoreDetails.date);

    // players
    for (let j = 0; j < scoreDetails.players.length; j++) {
      this.CurrentScore.addPlayer(scoreDetails.players[j].name);
    }

    // columns
    for (let j = 0; j < scoreDetails.columns.length; j++) {
      this.CurrentScore.addColumn(scoreDetails.columns[j].title);
    }

    // scores
    for (let j = 0; j < scoreDetails.scores.length; j++) {
      this.CurrentScore.addScore(scoreDetails.scores[j].playerIdx, scoreDetails.scores[j].columnIdx, scoreDetails.scores[j].value);
    }

    // set ordered score list
    this.playerInScoreOrder = this.CurrentScore.getPlayerIdxOrderByTotalScore() || [];
  }

  showByPlayer() {
    this.byPlayer = true;
    this.byColumn = false;
  }

  showByColumn() {
    this.byPlayer = false;
    this.byColumn = true;
  }

  getSortedColumnScores(columnIdx: number) {
    let sortedColumnScores = ([] as any[]);

    // get scores for this column
    for (let i = 0; i < this.CurrentScore.scores.length; i++) {
      if (this.CurrentScore.scores[i].columnIdx === columnIdx) {
        sortedColumnScores.push(this.CurrentScore.scores[i]);
      }
    }

    // sort by value
    sortedColumnScores.sort((a, b) => {
      return b.value - a.value;
    });

    return sortedColumnScores;
  }
}

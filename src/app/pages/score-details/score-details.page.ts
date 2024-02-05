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
  playerInRoundOrder: Array<any> = [];
  playerInScoreOrder: Array<any> = [];
  byPlayer: boolean = true;
  byRound: boolean = false;
  byColumn: boolean = false;
  loaded: boolean = false;

  cachedPlayerScoreTotalByRound: any = {};

  constructor(
    private actRoute: ActivatedRoute,
    private storage: StorageService,
  ) { }

  ngOnInit() {}

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
      this.CurrentScore.addScore(scoreDetails.scores[j].roundIdx, scoreDetails.scores[j].playerIdx, scoreDetails.scores[j].columnIdx, scoreDetails.scores[j].value);
    }

    // set ordered score list
    this.playerInScoreOrder = this.CurrentScore.getPlayerIdxOrderByTotalScore() || [];
    this.playerInRoundOrder = this.CurrentScore.getPlayerIdxOrderByRoundScore() || [];
  }

  showByRound() {
    this.byRound = true;
    this.byPlayer = false;
    this.byColumn = false;
  }

  showByPlayer() {
    this.byRound = false;
    this.byPlayer = true;
    this.byColumn = false;
  }

  showByColumn() {
    this.byRound = false;
    this.byPlayer = false;
    this.byColumn = true;
  }

  getSortedColumnScores(columnIdx: number) {
    let sortedColumnScores = ([] as any[]);

    // get scores for this column by round
    for (let i = 0; i < this.CurrentScore.scores.length; i++) {
      if (this.CurrentScore.scores[i].columnIdx === columnIdx) {
        let roundIdx = this.CurrentScore.scores[i].roundIdx;
        if (!(roundIdx in sortedColumnScores)) {
          sortedColumnScores[roundIdx] = [];
        }
        sortedColumnScores[roundIdx].push(this.CurrentScore.scores[i]);
      }
    }

    // sort it by value for each round
    for (let i = 0; i < sortedColumnScores.length; i++) {
      sortedColumnScores[i].sort((a: any, b: any) => {
        return b.value - a.value;
      });
    }

    return sortedColumnScores;
  }

  getPlayerScoreTotalByRound(playerIdx: number, roundIdx: number) {
    // check cache
    if (roundIdx in this.cachedPlayerScoreTotalByRound && playerIdx in this.cachedPlayerScoreTotalByRound[roundIdx]) {
      return this.cachedPlayerScoreTotalByRound[roundIdx][playerIdx];
    }

    // calculate total score for a player by round
    let total = 0;
    for (let i = 0; i < this.CurrentScore.scores.length; i++) {
      if (this.CurrentScore.scores[i].roundIdx === roundIdx && this.CurrentScore.scores[i].playerIdx === playerIdx) {
        total += this.CurrentScore.scores[i].value;
      }
    }

    // cache it
    if (!(roundIdx in this.cachedPlayerScoreTotalByRound)) {
      this.cachedPlayerScoreTotalByRound[roundIdx] = [];
    }
    if (!(playerIdx in this.cachedPlayerScoreTotalByRound[roundIdx])) {
      this.cachedPlayerScoreTotalByRound[roundIdx][playerIdx] = 0;
    }
    this.cachedPlayerScoreTotalByRound[roundIdx][playerIdx] = total;

    // return it
    return total;
  }
}

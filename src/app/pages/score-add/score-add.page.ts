import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { Score } from '../../classes/scoreList';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-score-add',
  templateUrl: './score-add.page.html',
  styleUrls: ['./score-add.page.scss'],
})
export class ScoreAddPage implements OnInit {
  step = 1;
  maxPlayers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  maxColumns: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  optGameName: string = '';
  optPlayers: number = 2;
  optColumns: number = 2;
  optPlayerNames: Array<string> = [];
  optColumnNames: Array<string> = [];
  optScore: Array<any> = [];

  constructor(
    private router: Router,
    private utilsSrv: UtilsService,
    private storage: StorageService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() { }

  // needs this to properly bind an array with ngModel
  trackByIdx(index: number, obj: any): any {
    return index;
  }

  close() {
    this.router.navigateByUrl('/score', { replaceUrl: true });
  }

  beforeMoveToStep(step: number) {
    switch(step) {
      case 2: {
        this.optPlayerNames = [];
        for (let i = 0; i < this.optPlayers; i++) {
          this.optPlayerNames.push('');
        }
        break;
      }

      case 4: {
        this.optColumnNames = [];
        for (let i = 0; i < this.optColumns; i++) {
          this.optColumnNames.push('');
        }
        break;
      }

      case 5: {
        this.optScore = [];
        for (let i = 0; i < this.optPlayers; i++) {
          this.optScore.push([]);
          for (let j = 0; j < this.optColumns; j++) {
            this.optScore[i].push(0);
          }
        }
        break;
      }

      default: {
        break;
      }
    }
  }

  moveToStep(step: number) {
    let warningMessage = this.checkCurrentStepAndReturnMessage(this.step);

    if (null !== warningMessage) {
      this.utilsSrv.showAlert('Warning', '', warningMessage, ['OK']);
      return;
    }

    this.beforeMoveToStep(step);
    this.step = step;
  }

  checkCurrentStepAndReturnMessage(step: number): string|null {
    let message: string|null = null;

    switch(step) {
      case 1: {
        // check if game name is filled
        if (this.optGameName === '') {
          message = 'Please fill in game name!';
        }
        break;
      }

      case 2: {
        // check if all player names are filled
        for (let i = 0; i < this.optPlayers; i++) {
          if (this.optPlayerNames[i] === '') {
            message = 'Please fill in all players name!';
          }
        }
        break;
      }

      case 4: {
        for (let i = 0; i < this.optColumns; i++) {
          if (this.optColumnNames[i] === '') {
            message = 'Please fill in all columns name!';
          }
        }
        break;
      }

      default: {
        break;
      }
    }

    return message;
  }

  async finish() {
    this.utilsSrv.showAlert('Confirm Finish', '', 'Are you sure? This action can\'t be undone.', [
      {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
      }, {
          text: 'Yes!',
          handler: () => {
            this.doFinish();
          }
      }
    ]);
  }

  async doFinish() {
    // insert data from form to ScoreList class
    let scoreList = new Score(this.storage);
    let today = this.datePipe.transform(Date.now(), "yyyy-MM-dd") ?? '';
    scoreList.setTitle(this.optGameName);
    scoreList.setDate(today);

    // set player names
    for (let i = 0; i < this.optPlayers; i++) {
      scoreList.addPlayer(this.optPlayerNames[i]);
    }

    // set column names
    for (let i = 0; i < this.optColumns; i++) {
      scoreList.addColumn(this.optColumnNames[i]);
    }

    // set score
    for (let i = 0; i < this.optPlayers; i++) {
      for (let j = 0; j < this.optColumns; j++) {
        scoreList.addScore(i, j, this.optScore[i][j]);
      }
    }

    // save score
    let insertedIdx = await scoreList.save();

    // open score page detail
    setTimeout(() => {
      this.router.navigate(['/score-details/' + insertedIdx], { replaceUrl: true });
    }, 250);
  }
}

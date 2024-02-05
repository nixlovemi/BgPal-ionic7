import { DB_KEY_SCORES } from '../classes/constants';
import { StorageService } from '../services/storage.service';

export class Score {
    title = '';
    date = ''; /* Y-m-d */
    players = ([] as any[]);
    columns = ([] as any[]);
    scores = ([] as any[]);

    constructor(private storage: StorageService) { }

    setTitle(title: string) {
        this.title = title;
    }

    setDate(date: string) {
        this.date = date;
    }

    addPlayer(name: string) {
        this.players.push({name});
    }

    addColumn(title: string) {
        this.columns.push({title});
    }

    addScore(roundIdx: number, playerIdx: number, columnIdx: number, value: number) {
        this.scores.push({roundIdx, playerIdx, columnIdx, value});
    }

    toJSON() {
        return {
            title: this.title,
            date: this.date,
            players: this.players,
            columns: this.columns,
            scores: this.scores
        };
    }

    getPlayerIdxOrderByRoundScore() {
        // create arrRound
        let arrRound = ([] as any[]);
        for (let j = 0; j < this.scores.length; j++) {
            let round = this.scores[j].roundIdx;
            if (!(round in arrRound)) {
                arrRound[round] = [];
            }
        }

        // add to arrRound players, columns and scores
        for (let j = 0; j < this.scores.length; j++) {
            let round = this.scores[j].roundIdx;
            let playerIdx = this.scores[j].playerIdx;
            let columnIdx = this.scores[j].columnIdx;
            let value = this.scores[j].value;

            if (!(playerIdx in arrRound[round])) {
                arrRound[round][playerIdx] = [];
            }

            if (!(columnIdx in arrRound[round][playerIdx])) {
                arrRound[round][playerIdx][columnIdx] = 0;
            }

            arrRound[round][playerIdx][columnIdx] = value;
        }

        return arrRound;
    }

    getPlayerIdxOrderByTotalScore() {
        let playerIdxOrderByTotalScore = ([] as any[]);

        // get total score for each player
        for (let i = 0; i < this.players.length; i++) {
            let totalScore = 0;
            let scorePerRound: Array<Array<any>> = [];
            let playerName = this.players[i].name;

            for (let j = 0; j < this.scores.length; j++) {
                let round = this.scores[j].roundIdx;
                if (!(round in scorePerRound)) {
                    scorePerRound[round] = [];
                }

                if (this.scores[j].playerIdx === i) {
                    scorePerRound[round].push(this.scores[j].value);
                    totalScore += this.scores[j].value;
                }
            }

            playerIdxOrderByTotalScore.push({playerIdx: i, playerName, scorePerRound, totalScore});
        }

        // sort by total score
        playerIdxOrderByTotalScore.sort((a, b) => {
            return b.totalScore - a.totalScore;
        });

        return playerIdxOrderByTotalScore;
    }

    async save(): Promise<number> {
        // add this score as JSON to /assets/score
        let json: Array<any> = await this.storage.get(DB_KEY_SCORES) ?? [];
        // console.log('class score list: save: json before', json);

        // add new item
        json.push(this.toJSON());
        // console.log('class score list: save: json after', json);

        // save to storage
        // console.log('class score list: save: saving to storage');
        await this.storage.set(DB_KEY_SCORES, json);
        
        // return last index
        return json.length - 1;
    }

    delete(index: number) {
        this.storage.get(DB_KEY_SCORES).then((json: Array<any>) => {
            // delete item
            json.splice(index, 1);

            // save to storage
            this.storage.set(DB_KEY_SCORES, json);
        });
    }
}
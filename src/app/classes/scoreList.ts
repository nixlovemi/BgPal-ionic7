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

    addScore(playerIdx: number, columnIdx: number, value: number) {
        this.scores.push({playerIdx, columnIdx, value});
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

    getPlayerIdxOrderByTotalScore() {
        let playerIdxOrderByTotalScore = ([] as any[]);

        // get total score for each player
        for (let i = 0; i < this.players.length; i++) {
            let totalScore = 0;
            let scores = ([] as any[]);
            let playerName = this.players[i].name;

            for (let j = 0; j < this.scores.length; j++) {
                if (this.scores[j].playerIdx === i) {
                    scores.push(this.scores[j].value);
                    totalScore += this.scores[j].value;
                }
            }

            playerIdxOrderByTotalScore.push({playerIdx: i, playerName, scores, totalScore});
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
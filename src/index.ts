import { Models } from "./models";
import request = require("request");

namespace qiitaadcalrankingbyhatebu {
  export class Main {
    target: Models.target;
    calendarListSourceUrl: string = "https://qiita.com/advent-calendar/2017/ranking/feedbacks/all";
    hatebuCounterApiUrl: string = "http://api.b.st-hatena.com/entry.counts?";
    constructor() {}

    public getCalendarList() {
      request(this.calendarListSourceUrl, (error, response, body) => {
        if (error) {
          console.dir(error);
        } else {
          console.log(body);
        }
      });
    }
  }
}

const main = new qiitaadcalrankingbyhatebu.Main();
main.getCalendarList();

//import { randomBytes } from "crypto";
import request = require("request");
import cheerio = require("cheerio");
import fs = require("fs");

export namespace Models {
  export interface rankingUrl {
    url: string;
    title: string;
    contentsUrls: Array<ContentsUrl>;
    hatebuCountSum: number;
  }

  export interface ContentsUrl {
    url: string;
    hatebuCount: number;
  }
}

namespace qiitaadcalrankingbyhatebu {
  export class Main {
    target: Array<Models.rankingUrl>;
    calendarListSourceUrl: string = "https://qiita.com/advent-calendar/2017/ranking/feedbacks/all";
    hatebuCounterApiUrl: string = "http://api.b.st-hatena.com/entry.counts?";
    outPutMarkdownFileName: string = "result.md";
    constructor() {}

    public async main() {
      console.log("01 : get ranking html");
      const body = await this.getHtml(this.calendarListSourceUrl);
      this.target = await this.getCalendarList(body);

      console.log("02 : get article url & hatebu count");
      for (let i = 0; i < this.target.length; i++) {
        const rankingFeedBody = await this.getHtml(this.target[i].url);
        this.target[i].contentsUrls = await this.getCalendarArticleList(rankingFeedBody);
        this.target[i].title = await this.getCalendarArticleTitle(rankingFeedBody);

        this.target[i] = await this.getHatebuCount(this.target[i]);
        console.log(this.target[i].hatebuCountSum + " : " + this.target[i].title + " : " + this.target[i].url);

        await new Promise(resolve => setTimeout(resolve, 1000)); // 他所のAPIを傷めないように1秒ウエイト
      }

      for (let i = 0; i < this.target.length; i++) {}

      console.log("03 : generate ranking content");
      this.target = this.target.sort((a, b) => {
        if (a.hatebuCountSum < b.hatebuCountSum) {
          return 1;
        } else if (a.hatebuCountSum > b.hatebuCountSum) {
          return -1;
        } else {
          return 0;
        }
      });
      let resultString: string = "rank | bookmarks | title \n |:---|:---|:---| \n";
      for (let i = 0; i < this.target.length; i++) {
        const markDownLine = i + 1 + " | " + this.target[i].hatebuCountSum + " | [" + this.target[i].title + "](" + this.target[i].url + ")";
        resultString = resultString + markDownLine + "\n";
      }
      fs.writeFileSync(this.outPutMarkdownFileName, resultString);

      console.log("99 : finish");
    }

    private getCalendarList(body: string): Promise<Array<Models.rankingUrl>> {
      return new Promise(async (resolve, reject) => {
        let target: Array<Models.rankingUrl> = [];

        const $ = cheerio.load(body);
        const link = $(".adventCalendarRankingListItem_calendarName").toArray();

        if (link.length > 0) {
          for (let i = 0; i < link.length; i++) {
            const ranking: Models.rankingUrl = {
              url: "https://qiita.com" + link[i].attribs.href + "/feed",
              title: "",
              contentsUrls: [],
              hatebuCountSum: 0
            };
            target.push(ranking);
          }
          resolve(target);
        } else {
          reject();
        }
      });
    }

    private getCalendarArticleList(body: string): Promise<Array<Models.ContentsUrl>> {
      return new Promise(async (resolve, reject) => {
        let urlList: Array<Models.ContentsUrl> = [];

        const $ = cheerio.load(body);
        const link = $("link")
          .filter((i, el) => {
            return el.parent.name === "entry";
          })
          .toArray();

        if (link.length > 0) {
          for (let i = 0; i < link.length; i++) {
            const ranking: Models.ContentsUrl = {
              url: link[i].attribs.href,
              hatebuCount: 0
            };
            urlList.push(ranking);
          }
          resolve(urlList);
        } else {
          reject();
        }
      });
    }

    private getCalendarArticleTitle(body: string): Promise<string> {
      return new Promise(async (resolve, reject) => {
        let urlList: Array<Models.ContentsUrl> = [];

        const $ = cheerio.load(body);
        let title = $("title").text();
        title = title.match(/(.*) Advent Calendarの投稿 - Qiita/);
        if (title[1]) {
          resolve(title[1]);
        } else {
          reject();
        }
      });
    }

    private getHatebuCount(target: Models.rankingUrl): Promise<Models.rankingUrl> {
      return new Promise(async (resolve, reject) => {
        let urlList: Array<string> = [];
        for (let i = 0; i < target.contentsUrls.length; i++) {
          urlList.push(target.contentsUrls[i].url);
        }
        const HatebuApiUrl = this.hatebuCounterApiUrl + "url=" + urlList.join("&url=");
        const hatebuApiResultString: string = await this.getHtml(HatebuApiUrl);
        const hatebuApiResult = JSON.parse(hatebuApiResultString);

        let hatebuTotalCount: number = 0;
        await Object.keys(hatebuApiResult).forEach(async key => {
          for (let i = 0; i < target.contentsUrls.length; i++) {
            if (target.contentsUrls[i].url === key) {
              target.contentsUrls[i].hatebuCount = hatebuApiResult[key];
              hatebuTotalCount += hatebuApiResult[key];
            }
          }
        });
        target.hatebuCountSum = hatebuTotalCount;
        resolve(target);
      });
    }

    private getHtml(url: string): Promise<string> {
      return new Promise((resolve, reject) => {
        request(url, async (error, response, body) => {
          if (error) {
            console.dir(error);
            reject(error);
          } else {
            resolve(body);
          }
        });
      });
    }
  }
}

const main = new qiitaadcalrankingbyhatebu.Main();
main.main();

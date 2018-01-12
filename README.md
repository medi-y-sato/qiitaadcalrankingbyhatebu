# QiitaAdcalRankingByHatebu

Qiita アドカレが Qiita 外記事の評価一切なしで世知辛いのではてブ数でランキング作ってみるテスト

## 使い方

**Qiita とはてなの API サーバにそれなりの量アクセスするので、何がまずいか分からない人は実行しないで下さい**

[生成済みのランキング](result.md) があるので、ランキング見たいだけならこちらでお願いします

```sh
git clone git@github.com:medi-y-sato/qiitaadcalrankingbyhatebu.git
npm install -D typescript
npm install
npm run exec
```

# やってること

## アドカレ一覧の取り方

**無い**

**無い**

仕方がないので `https://qiita.com/advent-calendar/2017/ranking/feedbacks/all` からスクレイピング

全日埋まってない奴出てきてないけど仕方がない

```typescript
const $ = cheerio.load(body);
const link = $(".adventCalendarRankingListItem_calendarName").toArray();
```

## アドカレのエントリ URL の取り方

アドカレの URL に `/feed` を付ける

```before
https://qiita.com/advent-calendar/2017/fromscratch
```

↓

```after
https://qiita.com/advent-calendar/2017/fromscratch/feed
```

なんと全文 RSS なので `feed/entry/` の 下記から取る

```url
    <link rel="alternate" type="text/html" href="https://qiita.com/dey_z/items/5de23d5add86deac9150"/>
```

```typescript
const $ = cheerio.load(body);
const link = $("link")
  .filter((i, el) => {
    return el.parent.name === "entry";
  })
  .toArray();
```

## はてブ数の取り方

`http://api.b.st-hatena.com/entry.counts?` に `url=[uri]` を並べると一挙に取れる

```例 : request
http://api.b.st-hatena.com/entry.counts?url=https://qiita.com/kimi_takasu/items/118ef6b07a33428fc5f4&url=https://qiita.com/fuku68/items/2bb0740b31ca940c325a
```

```例 : result
{"https://qiita.com/fuku68/items/2bb0740b31ca940c325a":0,"https://qiita.com/kimi_takasu/items/118ef6b07a33428fc5f4":4}
```

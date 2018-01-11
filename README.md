# QiitaAdcalRankingByHatebu

Qiita アドカレが Qiita 外記事の評価一切なしで世知辛いのではてブ数でランキング作ってみるテスト

## アドカレ一覧の取り方

**無い**

**無い**

仕方がないので `https://qiita.com/advent-calendar/2017/ranking/feedbacks/all` 辺りからスクレイピングしよう

全日埋まってない奴出てきてないけど仕方がない

## アドカレのエントリ URL の取り方

アドカレの URL に `/feed` を付ける

```before
https://qiita.com/advent-calendar/2017/fromscratch
```

```after
https://qiita.com/advent-calendar/2017/fromscratch/feed
```

なんと全文 RSS なので `feed/entry/` の 下記辺りから取ると良さげ

```url
    <link rel="alternate" type="text/html" href="https://qiita.com/dey_z/items/5de23d5add86deac9150"/>
```

## はてブ数の取り方

`http://api.b.st-hatena.com/entry.counts?` に `url=[uri]` を並べると一挙に取れる

```request
http://api.b.st-hatena.com/entry.counts?url=https://qiita.com/kimi_takasu/items/118ef6b07a33428fc5f4&url=https://qiita.com/fuku68/items/2bb0740b31ca940c325a
```

```result
{"https://qiita.com/fuku68/items/2bb0740b31ca940c325a":0,"https://qiita.com/kimi_takasu/items/118ef6b07a33428fc5f4":4}
```

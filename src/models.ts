export namespace Models {
  export interface target {
    ranking: Array<rankingUrl>;
  }
  export interface rankingUrl {
    url: string;
    contentsUrls: Array<ContentsUrl>;
    hatebuCountSum: number;
  }

  export interface ContentsUrl {
    url: string;
    hatebuCount: number;
  }
}

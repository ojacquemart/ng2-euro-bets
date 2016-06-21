export class Pagination {

  constructor(public currentIndex:number, public currentPage:number,
    public pageSize:number, public nbPages:number, public nbItems: number) {
  }

  copy(pageNumber:number) {
    let newIndex = Pagination.getIndexFromPage(pageNumber, this.pageSize);

    return Pagination.create(newIndex, this.pageSize, this.nbItems);
  }

  static create(index:number, pageSize:number = 50, nbItems:number) {
    let currentPage = Math.floor(index / pageSize);
    let currentIndexFromPage = Pagination.getIndexFromPage(currentPage, pageSize);
    let nbPages = Math.floor((nbItems -1) / pageSize);

    return new Pagination(currentIndexFromPage, currentPage, pageSize, nbPages, nbItems);
  }

  static getIndexFromPage(pageNumber:number, pageSize:number):number {
    return Math.floor(pageNumber * pageSize);
  }

}

export interface PaginationConfig {
  enabled: boolean;
  goTo(pageNumber: number);
}

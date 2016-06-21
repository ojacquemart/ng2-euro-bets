import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {Pagination} from '../../models/pagination.model';

@Component({
  selector: 'table-pagination',
  styles: [require('./pagination.scss')],
  template: require('./pagination.html')
})
export class PaginationCmp {

  @Input()
  private pagination:Pagination;

  @Output()
  private pageChanged:EventEmitter<Pagination> = new EventEmitter<Pagination>(false);

  constructor() {
    console.log('pagination @ init');
  }

  noPreviousPage() {
    return this.pagination.currentPage == 0;
  }

  noNextPage() {
    return this.pagination.currentPage === this.pagination.nbPages;
  }

  goToPage(pageNumber:number) {
    this.onPageChanged(pageNumber);
  }

  goToFirstPage() {
    this.onPageChanged(0);
  }

  goToLastPage() {
    this.onPageChanged(this.pagination.nbPages);
  }

  goToPreviousPage() {
    this.onPageChanged(this.pagination.currentPage - 1);
  }

  goToNextPage() {
    this.onPageChanged(this.pagination.currentPage + 1);
  }

  onPageChanged(pageNumber:number) {
    console.log('pagination @ page selected', pageNumber);

    let newPagination = this.pagination.copy(pageNumber);
    this.pagination = newPagination;

    this.pageChanged.emit(newPagination);
  }

  ngOnInit() {
    console.log('pagination @ ngOnInit', this.pagination);
  }

}

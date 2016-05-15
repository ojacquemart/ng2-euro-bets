import {Injectable, EventEmitter} from 'angular2/core';

@Injectable()
export class LoadingState {

  loading:boolean;
  loading$:EventEmitter<Boolean> = new EventEmitter<Boolean>();

  subscribe(fn:(loading:boolean) => void) {
    return this.loading$.subscribe(fn);
  }

  start() {
    this.loading = true;
    this.emitLoading();
  }

  stop() {
    this.loading = false;
    this.emitLoading();
  }

  private emitLoading() {
    this.loading$.emit(this.loading);
  }

}

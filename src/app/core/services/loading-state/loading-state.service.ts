import {Inject, Injectable, EventEmitter} from 'angular2/core';

@Injectable()
export class LoadingState {

  loading:boolean;
  loading$:EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public subscribe(fn:(loading:boolean) => void) {
    return this.loading$.subscribe(fn);
  }

}

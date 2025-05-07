import { Injectable } from '@angular/core';
import { Bar } from './bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarService {
  private barSubject: Subject<Bar[]> = new Subject<Bar[]>();
  bars: Bar[] = [];

  constructor(){}

  setBar(bar: Bar[]) {
    this.bars = bar;
    this.barSubject.next(bar);
  }

  getBar() {
    return this.barSubject.asObservable();
  }
}

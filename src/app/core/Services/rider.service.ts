import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiderService {
  private buttonClickSource = new Subject<void>();
  buttonClick$ = this.buttonClickSource.asObservable();

  constructor() { }

  triggerButtonClick() {
    this.buttonClickSource.next();
  }
}

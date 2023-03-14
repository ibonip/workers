import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventomenuService {

  constructor() { }

  private evento = new Subject<any>();

  emitEvent(event: any) {
    this.evento.next(event);
  }

  onEvent(): Observable<any> {
    return this.evento.asObservable();
  }

}

import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PendingActionsNotificaterService {
  private refreshPendingCounter: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true)

  constructor() {}

  getRefreshPendingCounter(): Observable<boolean> {
    return this.refreshPendingCounter.asObservable()
  }

  setRefreshPendingCounter(valor: boolean): void {
    this.refreshPendingCounter.next(valor)
  }

  getRefreshObserver() {
    return this.refreshPendingCounter
  }
}

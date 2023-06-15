import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core'

export const waitingTime = 7

@Component({
  selector: 'ivr',
  templateUrl: './ivr.component.html',
  styleUrls: ['./ivr.component.scss'],
})
export class IvrComponent implements OnInit, OnDestroy {
  @Input() formModel: any
  @Output() doReCall = new EventEmitter<any>()

  ivrTime: number
  ivrTimer: any

  ngOnInit(): void {
    this.startTimer()
  }

  startTimer() {
    this.ivrTime = waitingTime * 60 * 1000
    this.ivrTimer = setInterval(() => {
      this.ivrTime = this.ivrTime - 1000
      if (this.ivrTime == 0) {
        clearInterval(this.ivrTimer)
      }
    }, 1000)
  }

  ngOnDestroy(): void {
  }

  reCall() {
    if (this.ivrTime == 0) {
      this.startTimer()
      this.doReCall.emit()
    }
  }
}

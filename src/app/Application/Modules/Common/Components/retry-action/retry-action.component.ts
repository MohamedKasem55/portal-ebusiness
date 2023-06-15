import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-retry-action',
  templateUrl: './retry-action.component.html',
  styleUrls: ['./retry-action.component.scss']
})
export class RetryActionComponent implements OnInit {

  RETRY_INTERVAL = 8000

  @Output() onRetry = new EventEmitter<any>()

  canRetry: boolean = true

  constructor() { }

  ngOnInit(): void {
  }

  retry(event){
    if(this.canRetry){
      this.canRetry = false
      this.onRetry.emit(event)

      setTimeout(() => {
        this.canRetry = true
      }, this.RETRY_INTERVAL)
    }
  }
}

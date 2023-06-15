import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'sme-check',
  templateUrl: './sme-check.component.html',
  styleUrls: ['./sme-check.component.scss'],
})
export class SmeCheckComponent implements OnInit {
  @Input() img?: string
  @Input() title: string
  @Input() hasBody: boolean = true
  //Status Options = {error,success}
  @Input() status: string = 'default'
  className = ''
  constructor() {}

  ngOnInit(): void {
    switch (this.status) {
      case 'error':
        this.className = 'sme-check-error-icon'
        break
      case 'success':
        this.className = 'sme-check-success-icon'
        break
      case 'accept':
        this.className = 'sme-check-acceptance'
      case 'modal':
        this.className = 'sme-check-modal-success-icon'
        break
      default:
        this.className = ''
    }
  }
}

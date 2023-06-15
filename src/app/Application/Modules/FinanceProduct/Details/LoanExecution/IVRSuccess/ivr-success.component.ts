import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import {DatePipe} from "@angular/common";

@Component({
  selector: 'sellSuccess',
  templateUrl: './ivr-success.component.html',
  styleUrls: ['./ivr-success.component.scss'],
})
export class IvrSuccessComponent implements OnInit, OnDestroy {

  @Input() formModel: any
  public msg = ''
  public dateStr: string = null
  public isAR = false


  constructor(
    public router: Router,
    public translate: TranslateService,
    public datePipe: DatePipe,
  ) {
  }

  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.isAR = this.translate.currentLang === 'ar'
    const dateOfPurchase = this.formModel.controls['dateOfPurchase'].value
    let date = new Date()
    if (dateOfPurchase && dateOfPurchase != '') {
      date = new Date(dateOfPurchase)
    }
    this.dateStr = this.datePipe.transform(date.setDate(date.getDate() + 7), 'yyyy-MM-dd')

  }
}

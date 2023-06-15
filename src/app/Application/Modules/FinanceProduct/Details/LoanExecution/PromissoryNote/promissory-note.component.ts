import { DatePipe } from '@angular/common'
import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss'],
})
export class PromissoryNoteComponent implements OnInit, OnDestroy {
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

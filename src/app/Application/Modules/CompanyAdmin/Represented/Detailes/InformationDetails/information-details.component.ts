import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { PageType } from '../../represented.service'


@Component({
  selector: 'information-details',
  templateUrl: './information-details.component.html',
  styleUrls: ['./information-details.component.scss'],
})
export class RepresentedInformationDetailsComponent implements OnInit, OnDestroy {
  @Input() formModel: FormGroup
  @Input() pageType: PageType

  public bsConfig: any = {}
  public today: Date
  public issueDateMin: Date
  public footerHeight: any = 0
  public defaultHeight: any = 'auto'
  public isAllSelected: boolean = false
  public PageType = PageType
  public repStatus

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.repStatus = this.formModel.controls['repStatus'].value
    this.today = this.getToday(23, 59, 59)
    this.issueDateMin = this.getToday(0, 0, 0)
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )
  }

  getToday(h, m, s) {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth()
    let day = d.getDate()
    return new Date(year, month, day, h, m, s)
  }

}

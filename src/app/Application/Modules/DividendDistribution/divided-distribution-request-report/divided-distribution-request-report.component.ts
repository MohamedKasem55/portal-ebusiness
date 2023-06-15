import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { DividedDistributionRequestReportServiceService } from './divided-distribution-request-report-service.service'

@Component({
  selector: 'app-divided-distribution-request-report',
  templateUrl: './divided-distribution-request-report.component.html',
  styleUrls: ['./divided-distribution-request-report.component.scss'],
})
export class DividedDistributionRequestReportComponent
  implements OnInit, OnDestroy
{
  public step = 1

  public periods: Period[]
  public years: number[] = []
  public selectedPeriod: Period = { year: 0, quarters: [] }

  public form: FormGroup
  public dateFrom = new Date()
  public dateTo = new Date()
  subscriptions: Subscription[] = []
  bsConfig: any
  constructor(
    private dividendReqReportService: DividedDistributionRequestReportServiceService,
  ) {}

  async ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )

    this.initForm()

    this.periods = await this.dividendReqReportService
      .getPeriods()
      .toPromise()
      .then((r) => r.listPeriods as Period[])
    this.years = this.periods.map((p) => p.year)

    this.subscriptions.push(
      this.form
        .get('dateFrom')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          this.dateFrom = value ? value : new Date()
        }),
    )
    this.subscriptions.push(
      this.form
        .get('dateTo')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          this.dateTo = value ? value : new Date()
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  public onYearChange(year): void {
    this.selectedPeriod = this.periods.filter((p) => p.year === year)[0]
    this.form.controls['quarter'].reset()
  }

  public requestFile(): void {
    this.subscriptions.push(
      this.dividendReqReportService
        .requestReport(this.form.getRawValue())
        .subscribe((r: any) => {
          if (r.errorCode === '0') {
            this.step = 3
          }
        }),
    )
  }

  public goBack(): void {
    this.step = 1
    this.form.controls['recordType'].enable()
    this.form.controls['year'].enable()
    this.form.controls['quarter'].enable()
    this.form.controls['language'].enable()
  }

  public goToStep2(): void {
    this.step = 2
    this.form.controls['recordType'].disable()
    this.form.controls['year'].disable()
    this.form.controls['quarter'].disable()
    this.form.controls['language'].disable()
  }

  public finish(): void {
    this.goBack()
    this.initForm()
  }

  private initForm(): void {
    this.form = new FormGroup({
      fileType: new FormControl('P'),
      year: new FormControl('', Validators.required),
      quarter: new FormControl('', Validators.required),
      recordType: new FormControl('', Validators.required),
      language: new FormControl(''),
      dateFrom: new FormControl('', Validators.required),
      dateTo: new FormControl('', Validators.required),
    })
  }
}

interface Period {
  year: number
  quarters: number[]
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { StorageService } from '../../../../../core/storage/storage.service'
import { MonthlyStatisticsService } from '../../bill/monthly-statistics/monthly-statistics.service'

@Component({
  selector: 'app-monthly-select',
  template: `
    <div class="row">
      <div class="col-xs-1"></div>
      <div class="col-xs-4">
        <div class="form-group">
          <label>Month</label>
          <div class="sme-select form-control">
            <select [(ngModel)]="sharedVar" (ngModelChange)="change()">
              <option
                *ngFor="let mont of Monthly"
                [value]="mont.year + mont.month"
              >
                {{ mont.month }}/{{ mont.year }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-xs-5"></div>
    </div>
  `,
})
export class MonthSelectComponent implements OnInit {
  @Output() onChange = new EventEmitter()
  sharedVar: string
  // Usamos el decorador Output
  loaded = true
  dato: any = 0
  meses: any
  monthlyF: any
  FormMonth: FormGroup
  selectedValue = 'select'

  public datep = ''
  public Monthly: any
  public currentUser: any

  @Output() monthoselec = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private Monthlyservice: MonthlyStatisticsService,
    private storageService: StorageService,
  ) {}

  getResultdata() {
    this.Monthlyservice.getMonthsDate().subscribe((data) => {
      this.Monthly = data
      this.loaded = true
    })
  }

  ngOnInit(): void {
    this.buildForm()
    this.currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    this.getResultdata()
  }

  onError(result) {
    //
  }

  buildForm(): void {
    this.FormMonth = this.fb.group({
      Monthly: [this.Monthly, Validators.required],
    })
  }

  selectionChanged(va) {
    //console.log(va.target.value);
    this.monthoselec.emit({ value: this.sharedVar })
  }

  change() {
    //console.log("variable con chance"+this.sharedVar);
    this.onChange.emit({ value: this.sharedVar })
  }
}

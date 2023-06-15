import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core'
import {PrePaidCardRequestService} from "./pre-paid-card-request.service";
import {StaticService} from "../../Common/Services/static.service";
import {CommonValidators} from "../../Common/constants/common-validators.service";
import {TranslateService} from "@ngx-translate/core";
import {SimpleMQ} from "ng2-simple-mq";
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {UserJourney} from "./PrepaidCardRequestModel";

@Component({
  selector: 'app-pre-paid-card-request-step2',
  templateUrl: './pre-paid-card-request-step2.component.html',
  styleUrls: ['./pre-paid-card-request.component.scss'],
})
export class PrePaidCardRequestStep2Component implements OnInit {

  step = 2
  public sizeErrorID: boolean = false
  public typeErrorID: boolean = false
  public sizeErrorEmpCertificateAttach: boolean = false
  public typeErrorEmpCertificateAttach: boolean = false
  public formatedMaxSize: any
  public today: Date = new Date()

  constructor(
      public service: PrePaidCardRequestService,
      public staticService: StaticService,
      public commonValidators: CommonValidators,
      public translate: TranslateService,
      private smq: SimpleMQ,
  ) {
  }

  private readonly onDestroy$ = new Subject<any>()

  @Input() selectedUserJourney: UserJourney
  @Input() form: FormGroup
  @Input() selectedFiles: any
  @Output() onIdIqamaChange: EventEmitter<any> = new EventEmitter<any>()
  @Output() onEmpCertificateChange: EventEmitter<any> = new EventEmitter<any>()

  @HostListener('empCertificate', ['$event']) onFocus(event) {
    console.log('a field was focused!')
  }

  valueLists = ['nationalityCode', 'cityType']

  public nationalities
  public cities

  public accounts
  public gender = [
    {
      key: 'F',
      value: 'Female',
    },
    {
      key: 'M',
      value: 'Male',
    },
  ]

  bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
  )

  ngOnInit(): void {
    if (this.selectedFiles) {
      let files;
      files = {
        id_iqama: this.form.get('id_iqamaAttach').value,
        empCertificate: this.form.get('empCertificateAttach').value,
      }

      this.form.addControl('id_iqamaFile', new FormControl({
        value: '',
        disabled: true,
      }, Validators.compose([Validators.required])))
      this.form.addControl('empCertificateFile', new FormControl({
        value: '',
        disabled: true,
      }, Validators.compose([Validators.required])))

      this.selectedFiles = files
    }

    this.staticService.getAllCombos(this.valueLists)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((res) => {
          const nationalities = this.staticService.getCompoByName(
              'nationalityCode',
              res,
          ).values
          const cities = this.staticService.getCompoByName('cityType', res).values

          this.cities = []
          Object.keys(cities).map((key, index) => {
            this.cities.push({ key: key, value: cities[key] })
          })
          this.nationalities = []
          Object.keys(nationalities).map((key, index) => {
            this.nationalities.push({ key: key, value: nationalities[key] })
          })
        })
  }

  ngOnDestroy() {
    this.onDestroy$.next()
  }


  empCertificateChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      if (this.isAllowedType(fileList[0].name)) {
        if (fileList[0].size < 5242880) {
          this.form.controls['empCertificateFile'].setValue(fileList[0].name)
          this.onEmpCertificateChange.emit(fileList[0])
        } else {
          event.target.value = null
          this.form.controls['empCertificateFile'].setValue(null)
          this.smq.publish('error-mq', this.translate.instant('error.maxFileSizeExceeded'))
        }
      } else {
        event.target.value = null
        this.form.controls['empCertificate'].setValue(null)
        this.smq.publish('error-mq', this.translate.instant('error.typeError'))
      }
    }
  }

  isAllowedType(name: string) {
    const type = name.split('.').pop().toLowerCase()
    return type == 'pdf' || type == 'jpeg' || type == 'jpg' || type == 'gif' || type == 'png'
  }

  idIqamaAttachmentChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      if (this.isAllowedType(fileList[0].name)) {
        if (fileList[0].size < 5242880) {
          this.form.controls['id_iqamaFile'].setValue(fileList[0].name)
          this.onIdIqamaChange.emit(fileList[0])
        } else {
          event.target.value = null
          this.form.controls['id_iqamaFile'].setValue(null)
          this.smq.publish('error-mq', this.translate.instant('error.maxFileSizeExceeded'))
        }
      } else {
        event.target.value = null
        this.form.controls['id_iqamaAttach'].setValue(null)
        this.smq.publish('error-mq', this.translate.instant('error.typeError'))
      }
    }
  }
}

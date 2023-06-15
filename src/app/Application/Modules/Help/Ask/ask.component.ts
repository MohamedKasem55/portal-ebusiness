import { Component, OnInit } from '@angular/core'
import { AskService } from './ask.service'
import { StorageService } from '../../../../core/storage/storage.service'

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { TourService } from 'app/core/tour/services/tour.service'
import { HomeMainService } from '../../Home/Services/home-main.services'

@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss'],
})
export class AskComponent implements OnInit {
  step = 1
  cicNumber: string
  customerName: string

  servicesList = []
  problemsList = []

  listLoaded = false

  askForm: FormGroup

  responseSuccessful = false

  ticketNumber

  constructor(
    private service: AskService,
    public formBuilder: FormBuilder,
    public storage: StorageService,
    private activatedRoute: ActivatedRoute,
    private tourService: TourService,
    private homeMainService: HomeMainService,
  ) {
    this.cicNumber = JSON.parse(storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.customerName = JSON.parse(storage.retrieve('currentUser'))['user'][
      'userName'
    ]
  }

  ngOnInit() {
    if (
      (this.activatedRoute.snapshot as any)._routerState.url === '/help/tooltip'
    ) {
      this.tourService.startTour(this.homeMainService.getTour())
    }
    this.askForm = this.formBuilder.group({
      customerCic: new FormControl({ value: this.cicNumber, disabled: true }),
      customerName: new FormControl({
        value: this.customerName,
        disabled: true,
      }),
      customerEmail: new FormControl(
        '',
        Validators.pattern(/[a-z0-9\-\_\.]+\@[\w\d\-\_]+\.[\w]+/),
      ),
      mobileNumber: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
      ]),
      comments: new FormControl(),
      serviceValue: new FormControl(),
      problemValue: new FormControl(),
    })

    this.getStaticLists()

    window.scrollTo(0, 0)
  }

  proceed() {
    this.askForm.disable()
    this.step = 2
  }

  back() {
    this.askForm.enable()
    this.askForm.controls.customerCic.disable()
    this.askForm.controls.customerName.disable()
    this.step = 1
  }

  confirm() {
    this.service.submitData(this.askForm.value).subscribe((result) => {
      if (!result.error) {
        this.responseSuccessful = true
        this.ticketNumber = result.ticketCode
        this.step = 3
      }
    })
  }

  finish() {
    this.responseSuccessful = false
    this.ticketNumber = null
    this.askForm = this.formBuilder.group({
      customerCic: new FormControl({ value: this.cicNumber, disabled: true }),
      customerName: new FormControl({
        value: this.customerName,
        disabled: true,
      }),
      customerEmail: new FormControl('', [
        Validators.pattern(/[a-z0-9\-\_\.]+\@[\w\d\-\_]+\.[\w]+/),
      ]),
      mobileNumber: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
      ]),
      comments: new FormControl(),
      serviceValue: new FormControl(),
      problemValue: new FormControl(),
    })

    window.scrollTo(0, 0)

    this.step = 1
  }

  getStaticLists() {
    this.service.getServiceList(['askToAlRajhiService']).subscribe((result) => {
      const keys = Object.keys(result.props)
      const output = result.props
      for (const key of keys) {
        this.servicesList.push({
          key,
          value: output[key],
        })
      }
    })

    this.service
      .getServiceList(['askToAlRajhiServiceProblem'])
      .subscribe((result) => {
        const keys = Object.keys(result.props)
        const output = result.props
        for (const key of keys) {
          this.problemsList.push({
            key,
            value: output[key],
          })
        }
      })
    this.listLoaded = true
  }

  isValidEmail(): boolean {
    return (
      (this.askForm.controls.customerEmail.hasError('pattern') &&
        this.askForm.controls.customerEmail.touched) ||
      (this.askForm.controls.customerEmail.hasError('required') &&
        this.askForm.controls.customerEmail.touched)
    )
  }

  isValidPhone(): boolean {
    return (
      (this.askForm.controls.mobileNumber.hasError('required') &&
        this.askForm.controls.mobileNumber.touched) ||
      this.askForm.controls.mobileNumber.hasError('minlength')
    )
  }

  isValidService(): boolean {
    return (
      this.askForm.controls.serviceValue.hasError('required') &&
      this.askForm.controls.serviceValue.touched
    )
  }

  isValidProblem(): boolean {
    return (
      this.askForm.controls.problemValue.hasError('required') &&
      this.askForm.controls.problemValue.touched
    )
  }

  isValidComments(): boolean {
    return (
      this.askForm.controls.comments.hasError('email') ||
      (this.askForm.controls.comments.hasError('required') &&
        this.askForm.controls.comments.touched)
    )
  }

  proceedIsDisabled(): boolean {
    return (
      this.askForm.controls.customerEmail.errors !== null ||
      this.askForm.controls.mobileNumber.errors !== null ||
      this.askForm.controls.serviceValue.errors !== null ||
      this.askForm.controls.problemValue.errors !== null ||
      this.askForm.controls.comments.errors !== null
    )
  }
}

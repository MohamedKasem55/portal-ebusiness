import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { NationalAddressService } from '../../Services/national-address/national-address.service'
import { NationalAddressStep1Component } from './national-address-step1.component'
import { NationalAddressStep2Component } from './national-address-step2.component'

@Component({
  selector: 'app-national-address',
  templateUrl: '../../View/national-address/national-address.component.html',
})
export class NationalAddressComponent implements OnInit {
  step1NationalAddress: NationalAddressStep1Component
  step2NationalAddress: NationalAddressStep2Component

  formNational: FormGroup
  step: number
  messageError: any
  subscriptions: Subscription[] = []

  constructor(
    public translate: TranslateService,
    private router: Router,
    public nationalAddressService: NationalAddressService,
    public fb: FormBuilder,
    public injector: Injector,
  ) {
    this.step = 1
    this.formNational = this.fb.group({
      country: { value: 'Kingdom of Saudi Arabia', disabled: true },
      region: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', [Validators.required, Validators.maxLength(32)]],
      streetName: ['', [Validators.required, Validators.maxLength(64)]],
      postalCode: ['', [Validators.required, Validators.maxLength(5)]],
      additionalCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      buildingNo: [
        '',
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      unitNo: [
        '',
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    })
  }

  isValid() {
    this.formNational.markAllAsTouched()
    return this.formNational.valid
  }
  next() {
    switch (this.step) {
      case 1:
        if (this.isValid()) {
          this.nextStep()
        }
        break
      case 2:
        if (this.isValid()) {
          const data = {
            nationalAddressDTO: {
              additionalNum: this.formNational.controls.unitNo.value,
              buildingNum: this.formNational.controls.buildingNo.value,
              city: this.formNational.controls.city.value,
              ctryDistrict: this.formNational.controls.district.value,
              postalCode: this.formNational.controls.postalCode.value,
              stateProvince: this.formNational.controls.region.value,
              streetName: this.formNational.controls.streetName.value,
              unitNum: this.formNational.controls.unitNo.value,
            },
          }

          this.subscriptions.push(
            this.nationalAddressService.register(data).subscribe((result) => {
              if (
                result.hasOwnProperty('error') &&
                (<any>result).error instanceof Exception
              ) {
                this.onError(result)
                return
              } else {
                const storageService = this.injector.get(StorageService)
                const welcome = storageService.retrieve('welcome')
                welcome.nationalAdress = 'Y'
                storageService.store('welcome', welcome)
                this.nextStep()
              }
            }),
          )
        }
        break
      case 3:
        this.router.navigate(['/home'])
        break
    }
  }
  nextStep() {
    this.step = ++this.step % 4

    if (this.step === 0) {
      this.step = 1
    }
  }
  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  onInitStep1(events) {
    this.step1NationalAddress = events
  }

  onInitStep2(events) {
    this.step2NationalAddress = events
  }

  ngOnInit() {}

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }
}

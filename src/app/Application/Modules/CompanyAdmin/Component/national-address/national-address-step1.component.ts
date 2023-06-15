import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Exception } from '../../../../Model/exception'
import { NationalAddressService } from '../../Services/national-address/national-address.service'

@Component({
  selector: 'app-national-address-step1',
  templateUrl:
    '../../View/national-address/national-address-step1.component.html',
})
export class NationalAddressStep1Component implements OnInit {
  @Input() formNational: FormGroup
  @Output() onInit = new EventEmitter<any>()

  messageError = {}

  regions: any[] = []
  cities: any[] = []

  constructor(
    public fb: FormBuilder,
    public nationalService: NationalAddressService,
    public translate: TranslateService,
  ) {}

  ngOnInit() {
    this.getRegions()
    this.onInit.emit(this)
  }

  getRegions() {
    this.nationalService.getRegions().subscribe((response) => {
      if (
        response.hasOwnProperty('error') &&
        (<any>response).error instanceof Exception
      ) {
        this.onError(response)
      } else {
        this.regions = response
      }
    })
  }

  getCities(event: Event) {
    //console.log(event.target['value']);
    const region = event.target['value']
    this.nationalService.getCities(region).subscribe((res) => {
      if (
        res.hasOwnProperty('error') &&
        (<any>res).error instanceof Exception
      ) {
        this.onError(res)
      } else {
        this.cities = res
        if (this.formNational.get('city').value) {
          this.formNational.get('city').reset()
        }
        //console.log(this.formNational.get('city').status);
      }
      //console.log(region, this.cities);
    })
  }

  onError(error: any) {
    const res = error
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }
}

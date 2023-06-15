import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CustomPropertiesService } from '../../Modules/CompanyAdmin/Services/custom-properties.service'
import { StorageService } from '../../../core/storage/storage.service'


@Component({
  templateUrl: './vat-company.component.html',
  styleUrls: ['./vat-company.component.scss'],
  selector: 'vat-company-modal',
})
export class VATCompany implements OnInit, OnDestroy {

  @ViewChild('VATCompanyModal', { static: true })
  VATCompanyModal: ModalDirective

  constructor(
    public fb: FormBuilder,
    public customPropertiesService: CustomPropertiesService,
    private _storage: StorageService,
  ) {
  }

  public showSuccess: boolean = false
  public showLater: boolean = true
  public vatCompanyForm: FormGroup = new FormGroup({})


  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.vatCompanyForm = this.fb.group({
      registrationNumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
    })
  }

  updateLocalStorage() {
    let disclaimerList = this._storage.retrieve('disclaimerList')
    disclaimerList.forEach((item: any) => {
      if (item.type === 'vatTries') {
        item.show = false
      }
    })
    this._storage.store('disclaimerList', disclaimerList)
  }

  showModal(vatOption: any) {
    this.showLater = vatOption.dismissAllowed
    this.VATCompanyModal.show()
  }


  hideModal() {
    this.VATCompanyModal.hide()
    this.updateLocalStorage()
  }

  notEligible(){
    this.hideModal()
    this.customPropertiesService.incrementTries({ 'name': 'VAT', 'notEligible': true}).subscribe(() => {
    })
  }

  later() {
    this.hideModal()
    this.customPropertiesService.incrementTries({ 'name': 'VAT' }).subscribe(() => {
    })
  }

  agree() {
    this.hideModal()
    const data = {
      vatNumber: this.vatCompanyForm.get('registrationNumber').value,
    }
    this.customPropertiesService.updateCompanyParameters(data).subscribe((result) => {
      if (result && result.errorCode === "0") {
        this.showSuccess = true
        this.showModal({ dismissAllowed: this.showLater })
      }
    })
  }

  canProceed() {
    return !this.vatCompanyForm.valid
  }

}
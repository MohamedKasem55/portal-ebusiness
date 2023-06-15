import { Component, OnInit } from '@angular/core'
import { UpdateCrnService } from '../../Services/update-crn/update-crn.service'
import { Router } from '@angular/router'
import { StorageService } from '../../../../../core/storage/storage.service'
import { UpdateCRNrequest } from './UpdateCRNrequest'

@Component({
  selector: 'app-update-crn',
  templateUrl: './update-crn.component.html',
  styleUrls: ['./update-crn.component.scss'],
})
export class UpdateCRNComponent implements OnInit {
  step: any
  stepList: any
  wizardStep: number
  messageError = {}
  expiaryDate: string

  constructor(
    private updateCrnService: UpdateCrnService,
    private router: Router,
    public storageService: StorageService,
  ) {
    this.wizardStep = 1
  }

  ngOnInit(): void {}

  updateCRN() {
    const updateCRNrequest: UpdateCRNrequest = {
      profileNumber: this.company.profileNumber,
    }
    this.updateCrnService.updateCRN(updateCRNrequest).subscribe(
      (result: any) => {
        if (result && result.errorCode !== '0') {
          this.onError(result)
          return
        } else {
          this.wizardStep = 2
          this.expiaryDate = result.expiaryDate
          // do success
        }
      },
      (error) => {
        console.log(error)
      },
    )
  }

  nextStep() {
    this.updateCRN()
  }

  backToHome() {
    this.router.navigate(['/'])
  }

  onError(error: any) {
    const res = error
    this.messageError['code'] = res.errorCode
    this.messageError['description'] = res.errorDescription
  }

  get company() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const company = currentUser.company
    return company
  }
}

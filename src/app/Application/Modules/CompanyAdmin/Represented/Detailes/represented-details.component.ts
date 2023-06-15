import { Component, OnDestroy, OnInit } from '@angular/core'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { PageType, RepresentedService } from '../represented.service'
import { StorageService } from '../../../../../core/storage/storage.service'
import { DatePipe } from '@angular/common'
import imageCompression from 'browser-image-compression'
import { SimpleMQ } from 'ng2-simple-mq'

@Component({
  selector: 'represented-details',
  templateUrl: './represented-details.component.html',
  styleUrls: ['./represented-details.component.scss'],
})

export class RepresentedDetailsComponent extends AbstractWizardComponent
  implements OnInit, OnDestroy {

  public pageType: PageType
  public PageType = PageType
  public detailsForm: FormGroup
  public powerForm: FormGroup
  public accounts: any
  public powerList: any
  private repID: string = ''
  private txType: string = ''
  public isSaudi = false
  public showDelete = false

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    public representedService: RepresentedService,
    private storage: StorageService,
    private datePipe: DatePipe,
    private smq: SimpleMQ,
  ) {
    super(fb, translate, router)
  }

  goTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    let representedDetails = this.storage.retrieve('RepresentedDetails')
    if (!representedDetails) {
      this.cancel()
    } else {
      this.pageType = representedDetails.type
      this.repID = representedDetails.data
      switch (this.pageType) {
        case PageType.ADD:
          this.startAdd()
          break
        case PageType.VIEW:
          this.startView()
          break
      }
    }
  }

  startAdd() {
    this.representedService.getAccounts('ECAL').subscribe(result => {
      if (result === null) {
        this.onError(result)
      } else {
        this.accounts = result
        this.detailsForm = this.representedService.createDetailsForm({})
        this.powerForm = this.representedService.createPowerForm({})
        this.detailsForm.enable()
        this.powerForm.enable()
        this.powerForm.controls['repStartDate'].disable()
      }
    })
    this.representedService.getPowerList().subscribe(result => {
      this.powerList = result
    })
  }

  startView() {
    this.representedService.getRepDetails(this.repID).subscribe(result => {
      if (result === null) {
        this.onError(result)
      } else {
        this.accounts = result.repAccntsAuthLst
        this.powerList = result.repPowerLst
        this.detailsForm = this.representedService.createDetailsForm(result)
        this.powerForm = this.representedService.createPowerForm(result)
        this.detailsForm.disable()
        this.powerForm.disable()
      }
    })
  }

  startEdit() {
    this.goTop()
    this.pageType = PageType.EDIT
    this.powerForm.enable()
    this.powerForm.controls['signatureFile'].disable()
    this.powerForm.controls['repStartDate'].disable()
  }

  back() {
    this.goTop()
    if (this.pageType == PageType.VIEW) {
      this.cancel()
    } else {
      this.wizardStep--
      if ((this.wizardStep < 3 && this.pageType == PageType.ADD) || (this.wizardStep < 2 && this.pageType == PageType.EDIT)) {
        this.detailsForm.enable()
        this.powerForm.enable()
      }
    }
  }

  cancel() {
    this.storage.clear('RepresentedDetails')
    this.router.navigate(['/companyadmin/represented']).then(() => {
    })
  }

  toDashboard() {
    this.storage.clear('RepresentedDetails')
    this.router.navigate(['/']).then(() => {
    })
  }


  getWizardStepsCount() {
  }

  isDisabled() {
  }

  next() {
    this.goTop()
    switch (this.wizardStep) {
      case 1:
        this.wizardStep++
        if (this.pageType == PageType.EDIT) {
          this.detailsForm.disable()
          this.powerForm.disable()
        }
        break
      case 2:
        if (this.pageType == PageType.ADD) {
          this.wizardStep++
          this.detailsForm.disable()
          this.powerForm.disable()
        } else {
          this.edit()
        }
        break
      case 3:
        if (this.pageType == PageType.ADD) {
          this.add()
        }
        break
    }
  }

  onInitStep(step, events) {
  }

  valid() {
    switch (this.wizardStep) {
      case 1:
        if (this.detailsForm && this.pageType == PageType.ADD) {
          return this.detailsForm.valid && this.getSelectedAccounts().length > 0
        } else {
          if (this.powerForm && this.pageType == PageType.EDIT) {
            return this.powerForm.valid && this.getSelectedPowers().length > 0 && this.getSelectedAccounts().length > 0
          }
        }
        break
      case 2:
        if (this.powerForm && this.pageType == PageType.ADD) {
          return this.powerForm.valid && this.getSelectedPowers().length > 0
        }
        break
    }
    return true
  }

  delete() {
    this.showDelete = true
  }

  getSelectedAccounts() {
    let selectedAccounts = []
    this.accounts.forEach(item => {
      if (item.enabled == true) {
        selectedAccounts.push(item.fullAccountNumber)
      }
    })
    return selectedAccounts
  }

  getSelectedPowers() {
    let selectedPower = []
    this.powerList.forEach(item => {
      if (item.enabled == true) {
        selectedPower.push(item.key)
      }
    })
    return selectedPower
  }

  edit() {
    let data = {
      repAuthId: this.repID,
      repAccntsModLst: this.accounts.map(item => {
        return { fullAccountNumber: item.fullAccountNumber, enabled: item.enabled }
      }),
      repPowerModLst: this.powerList.map(item => {
        return { repPower: item.repPower, enabled: item.enabled }
      }),
      updtdRepEndDt: this.datePipe.transform(this.powerForm.controls['repEndDate'].value, 'yyyy-MM-dd'),
    }
    this.representedService.edit(data).subscribe(result => {
      if (result === null) {
        this.onError(result)
      } else {
        this.wizardStep++
      }
    })
  }

  add() {
    let data = {
      'repGivenName': this.detailsForm.controls['repGivenName'].value,
      'repMiddleName': this.detailsForm.controls['repMiddleName'].value,
      'repPaternalName': this.detailsForm.controls['repPaternalName'].value,
      'repFamilyName': this.detailsForm.controls['repFamilyName'].value,
      'repImage': null,
      'repBirthDt': this.datePipe.transform(this.detailsForm.controls['repBirthDt'].value, 'yyyy-MM-dd'),
      'repStartDate': this.datePipe.transform(this.powerForm.controls['repStartDate'].value, 'yyyy-MM-dd'),
      'repEndDate': this.datePipe.transform(this.powerForm.controls['repEndDate'].value, 'yyyy-MM-dd'),
      'repAccntsAuthLst': this.getSelectedAccounts(),
      'repPowerLst': this.getSelectedPowers(),
      'repPhone': {
        'repPhoneNum': this.detailsForm.controls['repPhone'].value,
      },
      'repIdentityInfo': {
        'repIDNum': this.detailsForm.controls['repIDNum'].value,
        'repIDIssuerName': this.detailsForm.controls['repIDIssuerName'].value,
        'repIDIssueDt': this.datePipe.transform(this.detailsForm.controls['repIDIssueDt'].value, 'yyyy-MM-dd'),
        'repIDExpDt': this.datePipe.transform(this.detailsForm.controls['repIDExpDt'].value, 'yyyy-MM-dd'),
      },
    }

    this.convertFileToURL(this.powerForm.controls['signatureFile'].value).then(file => {
      if (file && file != 'size-error' && file != 'compress-error') {
        data.repImage = file
        this.doAdd(data)
      } else {
        if (file == 'compress-error') {
          this.smq.publish('error-mq', this.translate.instant('represented.invalidFile'))
        }
        if (file == 'size-error') {
          this.smq.publish('error-mq', this.translate.instant('represented.sizeError'))
        }
      }
    }).catch(() => {
      this.smq.publish('error-mq', this.translate.instant('represented.invalidFile'))
    })
  }

  public doAdd(data) {
    this.representedService.add(data).subscribe(result => {
      if (result === null) {
        this.onError(result)
      } else {
        this.isSaudi = result.saudi
        this.wizardStep++
      }
    })
  }

  public compress(file) {
    const options: any = {
      maxWidthOrHeight: 250,
      maxIteration: 100,
      initialQuality: 0.1,
      useWebWorker: false,
    }
    return new Promise((resolve) => {
      imageCompression(file, options).then(img => {
        if (img.size < 3000) {
          resolve(img)
        } else {
          resolve('size-error')
        }
      }).catch(() => {
        resolve('compress-error')
      })
    })
  }

  public convertFileToURL(file) {
    this.smq.publish('loader-mq', true)
    return new Promise((resolve) => {
      this.compress(file).then((result: any) => {
        if (result && result != 'size-error' && result != 'compress-error') {
          const reader = new FileReader()
          reader.readAsDataURL(result)
          reader.onload = () => {
            console.log(reader.result)
            this.smq.publish('loader-mq', false)
            resolve(reader.result)
          }
        } else {
          this.smq.publish('loader-mq', false)
          resolve(result)
        }
      })
    })
  }


  deleteAction(flag) {
    this.showDelete = false
    let data = [
      {
        'repAuthId': this.repID,
        'repDelReason': 'Delete',
      },
    ]
    if (flag) {
      this.representedService.deleteRep(data).subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.cancel()
        }
      })
    }
  }

}

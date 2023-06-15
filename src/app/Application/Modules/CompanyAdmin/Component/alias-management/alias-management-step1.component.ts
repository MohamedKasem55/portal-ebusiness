import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '../../../../../core/storage/storage.service'
import { AccountsList } from '../../../Accounts/Services/accounts-list-data.service'
import { AliasManagementService } from '../../Services/alias-management.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-alias-management-step1',
  templateUrl: './alias-management-step1.component.html',
  styleUrls: ['./alias-management.component.scss'],
})
export class AliasManagementStep1Component implements OnInit {
  @Input() form: any
  @Output() action = new EventEmitter<any>()

  accounts: any = []
  showAliesDetails: boolean = false
  mensajeError: any = {}
  aliasDetails: any
  selectedAccount: any
  isCR: boolean = false
  isMobile: boolean = false
  isEmial: boolean = false
  crValue: string = ''
  mobileValue: string = ''
  emailValue: string = ''

  constructor(
    private router: Router,
    private storageService: StorageService,
    private accountsListService: AccountsList,
    private aliasManagementService: AliasManagementService,
  ) {}

  ngOnInit(): void {
    this.accountsListService.getAccountsList().subscribe((data) => {
      this.accounts = this.extractAccountKeyValue(data.listAccount)
    })
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      if (account[i].currency == '608')
        accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  accountSelected() {
    this.showAliesDetails = true
    let accountControl = this.form.get('account') as FormControl
    this.aliasManagementService
      .getIPSList(accountControl.value)
      .subscribe((result) => {
        if (result.errorCode != '0') {
          this.onError(result)
          return
        } else {
          this.aliasDetails = result.proxyList
          this.rest()
          this.aliasDetails.forEach((element) => {
            switch (element.type) {
              case 'CR_OR_UNNID':
                this.isCR = true
                this.crValue = element.value
                ;(this.form.get('crNumber') as FormControl).setValue(
                  element.value,
                )
                break
              case 'MOIBLE_NUMBER':
                this.isMobile = true
                this.mobileValue = element.value
                ;(this.form.get('mobile') as FormControl).setValue(
                  element.value,
                )
                break
              case 'EMAIL':
                this.isEmial = true
                this.emailValue = element.value
                ;(this.form.get('email') as FormControl).setValue(element.value)
                break
            }
          })
          this.showAliesDetails = true
        }
      })
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  unLinkAll() {
    this.action.emit({ action: 'DELINK_ALL' })
  }

  setLinkAction(type: string) {
    this.action.emit({ type, action: 'LINK' })
  }

  setUnLinkAction(type: string) {
    let registrationId = ''
    this.aliasDetails.forEach((element) => {
      switch (type) {
        case 'UNN':
          if (element.type == 'CR_OR_UNNID') {
            registrationId = element.registrationId
          }
          break
        case 'MOBILE':
          if (element.type == 'MOIBLE_NUMBER') {
            registrationId = element.registrationId
          }
          break
        case 'EMAIL':
          if (element.type == 'EMAIL') {
            registrationId = element.registrationId
          }
          break
      }
    })
    this.action.emit({ type, action: 'DELINK', registrationId })
  }

  isDisabled(type: string) {
    switch (type) {
      case 'UNN':
        // let crNumberControl = this.form.get('crNumber') as FormControl;
        // return crNumberControl.invalid;
        return this.crValue == ''
      case 'MOBILE':
        // let mobileCrontrol = this.form.get('mobile') as FormControl;
        // return mobileCrontrol.invalid;
        return this.mobileValue == ''
      case 'EMAIL':
        // let emailCrontrol = this.form.get('email') as FormControl;
        // return emailCrontrol.invalid;
        return this.emailValue == ''
    }
  }

  rest() {
    this.isCR = false
    this.isMobile = false
    this.isEmial = false
    this.crValue = this.getCRNumber()
    ;(this.form.get('crNumber') as FormControl).setValue(this.crValue)
    this.mobileValue = this.getMobile()
    ;(this.form.get('mobile') as FormControl).setValue(this.mobileValue)
    this.emailValue = this.getEmail()
    ;(this.form.get('email') as FormControl).setValue(this.emailValue)
  }

  getCRNumber() {
    const company = this.storageService.retrieve('company')
    if (company.idNumber != null) {
      if (company.idNumber.charAt(0) == '7') return company.idNumber
      else return ''
    } else {
      return ''
    }
  }

  getMobile() {
    const user = this.storageService.retrieve('user')
    return user.mobile
  }

  getEmail() {
    const user = this.storageService.retrieve('user')
    return user.email
  }
}

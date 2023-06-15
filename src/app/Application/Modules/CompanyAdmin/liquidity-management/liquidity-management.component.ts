import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { LiquidityManagementService } from '../Services/liquidity-management-list.service'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-liquidity-management',
  templateUrl: './liquidity-management.component.html',
  styleUrls: ['./liquidity-management.component.scss'],
})
export class LiquidityManagementComponent
  extends DatatableMobileComponent
  implements OnInit
{
  loaded: boolean

  internalAccountsSelected = []
  internalSubCICAccountsSelected = []
  externalAccountsSelected = []

  copyInternalAccountsSelected = []
  copyInternalSubCICAccountsSelected = []
  copyExternalAccountsSelected = []

  result: any
  internalAccounts: any = []
  internalSubCICAccounts: any
  subCICProfileNumber: any
  externalAccounts: any

  elementRef

  dataChanged = false

  loadSuccess = false
  public step: number

  constructor(
    public serv: LiquidityManagementService,
    public translate: TranslateService,
  ) {
    super()
  }

  ngOnInit() {
    this.internalAccounts = []
    this.internalSubCICAccounts = []
    this.externalAccounts = []
    this.step = 1
    this.getResultdata()
  }

  getResultdata() {
    this.serv.getResults().subscribe((result) => {
      if (result === null) {
        this.loaded = false
        //console.log("error-->" + result);
      } else {
        //console.log('Result: ', result.companyLiquidityAccountsDSO);
        this.result = result
        this.internalAccounts = result.companyLiquidityAccountsDSO
          .internalAccounts
          ? result.companyLiquidityAccountsDSO.internalAccounts
          : []
        if (
          typeof result.companyLiquidityAccountsDSO.internalSCICAccounts[0] !=
          'undefined'
        ) {
          this.internalSubCICAccounts =
            result.companyLiquidityAccountsDSO.internalSCICAccounts[0].subCICAccounts
        }
        if (
          typeof result.companyLiquidityAccountsDSO.internalSCICAccounts[0] !=
          'undefined'
        ) {
          this.subCICProfileNumber =
            result.companyLiquidityAccountsDSO.internalSCICAccounts[0].subCICProfileNumber
        }
        this.externalAccounts = result.companyLiquidityAccountsDSO
          .externalAccounts
          ? result.companyLiquidityAccountsDSO.externalAccounts
          : []

        this.loaded = true

        this.preSelect()

        this.elementRef = document.getElementsByTagName('label')

        window.scrollTo(0, 0)
      }
    })
  }

  goBack() {
    this.disableCheckboxes(false)

    this.step = 1
  }

  goNext() {
    this.disableCheckboxes(true)

    this.step = 2

    window.scrollTo(0, 140)
  }

  confirm() {
    const data = this.processDataToPost()

    this.serv.saveData(data).subscribe((result) => {
      if (result.errorCode === '0') {
        this.loadSuccess = true
      }
    })
    this.step = 3
  }

  finish() {
    this.loaded = false
    this.dataChanged = false

    this.internalAccountsSelected = []
    this.internalSubCICAccountsSelected = []
    this.externalAccountsSelected = []

    this.copyInternalAccountsSelected = []
    this.copyInternalSubCICAccountsSelected = []
    this.copyExternalAccountsSelected = []

    this.result = null
    this.internalAccounts = []
    this.internalSubCICAccounts = []
    this.subCICProfileNumber = null
    this.externalAccounts = []

    this.getResultdata()
    this.step = 1
  }

  disableCheckboxes(disabled) {
    for (const element of this.elementRef) {
      if (disabled) {
        //console.log(element);
        element.children[0].disabled = true
        element.className = 'datatable-checkbox-disabled'
      } else {
        element.children[0].disabled = false
        element.className = 'datatable-checkbox'
      }
    }
  }

  processDataToPost(): any {
    const modifiedResult = JSON.parse(JSON.stringify(this.result))

    this.result.companyLiquidityAccountsDSO.externalAccounts.forEach((row) => {
      if (!this.externalAccountsSelected.includes(row)) {
        modifiedResult.companyLiquidityAccountsDSO.externalAccounts[
          modifiedResult.companyLiquidityAccountsDSO.externalAccounts.findIndex(
            (x) =>
              x.bankBusinessIdentifierCode === row.bankBusinessIdentifierCode,
          )
        ].selected = 'N'
      } else {
        if (row.selected === 'N') {
          modifiedResult.companyLiquidityAccountsDSO.externalAccounts[
            modifiedResult.companyLiquidityAccountsDSO.externalAccounts.findIndex(
              (x) =>
                x.bankBusinessIdentifierCode === row.bankBusinessIdentifierCode,
            )
          ].selected = 'Y'
        }
      }
    })

    this.result.companyLiquidityAccountsDSO.internalAccounts.forEach((row) => {
      if (!this.internalAccountsSelected.includes(row)) {
        modifiedResult.companyLiquidityAccountsDSO.internalAccounts[
          modifiedResult.companyLiquidityAccountsDSO.internalAccounts.findIndex(
            (x) => x.liquidityAccountNumber === row.liquidityAccountNumber,
          )
        ].selected = 'N'
      } else {
        if (row.selected === 'N') {
          modifiedResult.companyLiquidityAccountsDSO.internalAccounts[
            modifiedResult.companyLiquidityAccountsDSO.internalAccounts.findIndex(
              (x) => x.liquidityAccountNumber === row.liquidityAccountNumber,
            )
          ].selected = 'Y'
        }
      }
    })

    if (
      typeof this.result.companyLiquidityAccountsDSO.internalSCICAccounts[0] !=
      'undefined'
    ) {
      this.result.companyLiquidityAccountsDSO.internalSCICAccounts[0].subCICAccounts.forEach(
        (row) => {
          if (!this.internalSubCICAccountsSelected.includes(row)) {
            modifiedResult.companyLiquidityAccountsDSO.internalSCICAccounts[0].subCICAccounts[
              modifiedResult.companyLiquidityAccountsDSO.internalSCICAccounts[0].subCICAccounts.findIndex(
                (x) => x.liquidityAccountNumber === row.liquidityAccountNumber,
              )
            ].selected = 'N'
          } else {
            if (row.selected === 'N') {
              modifiedResult.companyLiquidityAccountsDSO.internalSCICAccounts[0].subCICAccounts[
                modifiedResult.companyLiquidityAccountsDSO.internalSCICAccounts[0].subCICAccounts.findIndex(
                  (x) =>
                    x.liquidityAccountNumber === row.liquidityAccountNumber,
                )
              ].selected = 'Y'
            }
          }
        },
      )
    }
    const data = {
      companyLiquidityAccountsDSO: modifiedResult.companyLiquidityAccountsDSO,
    }
    return data
  }

  onSelectInternal({ selected }) {
    this.internalAccountsSelected.splice(
      0,
      this.internalAccountsSelected.length,
    )
    this.internalAccountsSelected.push(...selected)

    this.dataChanged = true
  }

  onSelectInternalSub({ selected }) {
    this.internalSubCICAccountsSelected.splice(
      0,
      this.internalSubCICAccountsSelected.length,
    )
    this.internalSubCICAccountsSelected.push(...selected)

    this.dataChanged = true
  }

  onSelectExternal({ selected }) {
    this.externalAccountsSelected.splice(
      0,
      this.externalAccountsSelected.length,
    )
    this.externalAccountsSelected.push(...selected)

    this.dataChanged = true
  }
  preSelect() {
    if (this.internalAccounts) {
      this.internalAccounts.forEach((row) => {
        if (row.selected === 'Y') {
          this.internalAccountsSelected.push(row)
        }
      })
    }
    this.copyInternalAccountsSelected = JSON.parse(
      JSON.stringify(this.internalAccountsSelected),
    )

    if (this.internalSubCICAccounts) {
      this.internalSubCICAccounts.forEach((row) => {
        if (row.selected === 'Y') {
          this.internalSubCICAccountsSelected.push(row)
        }
      })
    }
    this.copyInternalSubCICAccountsSelected = JSON.parse(
      JSON.stringify(this.internalSubCICAccountsSelected),
    )

    if (this.externalAccounts) {
      this.externalAccounts.forEach((row) => {
        if (row.selected === 'Y') {
          this.externalAccountsSelected.push(row)
        }
      })
    }

    this.copyExternalAccountsSelected = JSON.parse(
      JSON.stringify(this.externalAccountsSelected),
    )
  }
}

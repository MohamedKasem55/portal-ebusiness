import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
//import {Dictionary} from '../../../../Application/Model/dictionary';
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { PopoverDirective } from 'ngx-bootstrap/popover'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Account } from '../../../../Model/account'
import { PagedData } from '../../../../Model/paged-data'
import { RequestStatementService } from '../../../Accounts/RequestStatement/request-statement.service'
import { SelectedDataService } from '../../../Accounts/Services/selected-data-service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { StaticService } from '../../../Common/Services/static.service'
import { BillPayment } from '../../Model/bill-payment'
import { BillPaymentService } from './bill-payment.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  templateUrl: './bill-payments.component.html',
})
export class BillPaymentsComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  authorization: any

  @ViewChild('authorization') set content(content) {
    this.authorization = content
  }

  @ViewChild('popoverBillDateTo')
  popoverBillDateTo: PopoverDirective
  @ViewChild('popoverBillDateFrom')
  popoverBillDateFrom: PopoverDirective
  @ViewChild('table') table: any
  @ViewChild('billPaymentTable') tableStep3
  @ViewChild('account_sl') account_sl

  //openFromCalendar = true;
  //openToCalendar = true;
  deleteBill = false

  isSearchCollapsed = true

  tablePage: PagedData<BillPayment>

  tableSelected: any[] = []

  tableSuscription: Subscription

  searchForm: FormGroup
  billDateFrom = new Date()
  billDateTo = new Date()
  search: any[] = []
  searchFilterData: any = {}
  show = false

  //accountsSuscription: Subscription;

  accounts: Array<Account> = new Array<Account>()

  selectedAccount: Account

  wizardStep: number

  payBillsView: boolean

  billCodes: any[] = []
  /*In case billcodes have to be categorized*/
  bill: any[] = []
  //categoryAr = [];
  group: any[] = []
  //showGroups = false;

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate = new RequestValidate()

  bsConfig: any

  batchListsContainer: any
  billsSelected: any[] = []

  data: any
  statusOk = true

  combosData: any = {}
  errors: any[] = []

  selectAllOnPage: any = []
  totalAmounts: any

  constructor(
    public translate: TranslateService,
    private billPaymentService: BillPaymentService,
    //private accountBalanceService: AccountBalanceService,
    public authenticationService: AuthenticationService,
    public sharedAcountData: SelectedDataService,
    public storageService: StorageService,
    public fb: FormBuilder,
    private staticService: StaticService,
    public rsService: RequestStatementService,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {
    super()
    this.tablePage = new PagedData<BillPayment>()
    this.searchForm = this.fb.group({
      searchType: [null, []],
      group: [null, []],
      billCode: [null, []],
      billRef: [null, []],
      billNickName: [null, []],
      billAmountFrom: [null, []],
      billAmountTo: [null, []],
      billDateFrom: [new Date(), []],
      billDateTo: [new Date(), []],
    })

    const combosKeys = ['billStatus']
    this.combosData['billStatus'] = []
    this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
      const data = comboData

      const billStatusValues = data[combosKeys.indexOf('billStatus')]['values']
      Object.keys(billStatusValues).map((key, index) => {
        this.combosData['billStatus'][key] = billStatusValues[key]
      })
    })
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.wizardStep == 1) {
      tablas.push(this.table)
    }
    if (this.wizardStep == 3) {
      tablas.push(this.tableStep3)
    }
    return tablas
  }

  searchFilterSubmit() {
    this.searchForm.get('billDateFrom').setValue(this.billDateFrom)
    this.searchForm.get('billDateTo').setValue(this.billDateTo)
    this.searchFilterData = Object.assign({}, this.searchForm.value)
    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    if (this.tableSuscription) {
      this.tableSuscription.unsubscribe()
    }

    this.tableSuscription = this.billPaymentService
      .getResults(
        pageInfo.offset,
        this.tablePage.page.pageSize,
        this.searchFilterData.billAmountFrom,
        this.searchFilterData.billAmountTo,
        this.searchFilterData.billCode,
        this.searchFilterData.billRef,
        this.searchFilterData.billDateFrom,
        this.searchFilterData.billDateTo,
        this.searchFilterData.billNickName,
      )
      .subscribe((result) => {
        //console.log(result);
        for (const tableSelectedItem of this.tableSelected) {
          for (const tablePageItem of result.pagedData.data) {
            if (this.getId(tableSelectedItem) == this.getId(tablePageItem)) {
              tablePageItem['amount'] = tableSelectedItem['amount']
            }
          }
        }
        this.tablePage = result.pagedData
        this.billCodes = result.billCodes
        //console.log(this.billCodes[1]['categoryEn']);
        let actualResult
        for (let i = 0; i < this.billCodes.length; i++) {
          let notRepeat = true
          actualResult = this.billCodes[i]
          if (i === 0) {
            this.bill[i] = actualResult
          }
          for (let j = 0; j < this.bill.length; j++) {
            if (actualResult['categoryEn'] === this.bill[j]['categoryEn']) {
              notRepeat = false
            }
          }
          if (notRepeat) {
            this.bill.push(actualResult)
          }
        }
        if (this.search.length <= 0) {
          this.search = result.billCodes
        }
        this.accounts = result['accounts']
        const acc = this.sharedAcountData.getModelServiceCurrentAccount()
        // this.sharedAcountData.clearModelServiceCurrentAccount();
        this.setSelectedAccount(acc)

        this.transformStatus()
        //if(this.accounts&&this.accounts.length>0)this.selectedAccount=this.accounts[0];
      })
  }

  accountChange($event) {
    //
    this.sharedAcountData.setModelServiceCurrentAccount($event)
  }

  transformStatus() {
    //console.log(this.combosData);
    //console.log(this.tablePage);
    if (this.tablePage && this.tablePage.data) {
      for (const item of this.tablePage.data) {
        const status = this.combosData['billStatus'][item.status1]
          ? this.combosData['billStatus'][item.status1]
          : item.status1
        item.statusTrans = status
      }
    }
  }

  amountValid(): boolean {
    return this.rsService.amountValidCheck(
      this.searchForm.get('billAmountFrom').value,
      this.searchForm.get('billAmountTo').value,
    )
  }

  getBillCodes() {
    this.billPaymentService.getBillCodes().subscribe((result) => {
      if (result.error) {
        //console.log("Error" + result.error);
      } else {
        this.billCodes = result.billCodes
        this.group = this.billCodes
      }
    })
  }

  /*In case billcodes have to be categorized*/
  searchByGroup(group) {
    if (group) {
      this.group = this.billCodes.filter(
        (bill) => bill['categoryEn'] === group['categoryEn'],
      )
      this.searchForm.get('billCode').setValue(null)
    } else {
      this.group = []
      this.searchForm.get('billCode').setValue(null)
    }
  }

  setSelectedAccount(acc: any) {
    if (acc) {
      for (let i = this.accounts.length - 1; i >= 0; i--) {
        if (this.accounts[i].fullAccountNumber == acc.fullAccountNumber) {
          this.selectedAccount = this.accounts[i]
        }
      }
    }
  }

  displayCheck(row) {
    return row.status !== 'P'
  }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    if (typeof selected != 'undefined') {
      this.selectAllOnPage[this.tablePage.page.pageNumber] = false

      this.tableSelected.splice(0, this.tableSelected.length)
      this.tableSelected.push(...selected)
      //console.log(this.tableSelected);
    }
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.tablePage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelected.length > 0) {
        this.tablePage.data.map((bill) => {
          this.tableSelected = this.tableSelected.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.tableSelected.push(...this.tablePage.data)
      this.selectAllOnPage[this.tablePage.page.pageNumber] = true
      //console.log('-----------Select All----');
      //console.log(this.tableSelected);
    } else {
      // Unselect all
      this.tablePage.data.map((bill) => {
        this.tableSelected = this.tableSelected.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.tablePage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log(this.tableSelected)
    }
  }

  removeSelectedBill(index) {
    this.tableSelected.splice(index, 1)
    this.billsSelected.splice(index, 1)
    if (
      this.batchListsContainer &&
      this.batchListsContainer.toProcess &&
      this.batchListsContainer.toProcess[index]
    ) {
      this.batchListsContainer.toProcess.splice(index, 1)
    }
  }

  sort() {
    this.setPage(null)
  }

  addError() {
    this.errors = []
    if (this.selectedAccount == null) {
      this.errors.push('error.selectAccount')
      setTimeout(() => {
        this.account_sl.nativeElement.focus()
      }, 200)
      return true
    }
    if (this.tableSelected && this.tableSelected.length == 0) {
      this.errors.push('error.selectBill')
      setTimeout(() => {
        this.account_sl.nativeElement.focus()
      }, 200)
      return true
    }
  }

  payBills() {
    if (this.addError()) {
      return
    }

    if (this.tableSelected && this.tableSelected.length > 0) {
      this.billPaymentService
        .validate(this.selectedAccount, this.tableSelected)
        .subscribe((result) => {
          if (result.errorCode == '0') {
            this.billsSelected = []
            this.batchListsContainer = result['batchListsContainer']
            for (
              let i = 0;
              i < result['batchListsContainer'].toProcess.length;
              i++
            ) {
              const bill = new BillPayment(
                result['batchListsContainer'].toProcess[i].billPaymentDetailsPk,
                result['batchListsContainer'].toProcess[i].billerName,
                result['batchListsContainer'].toProcess[i].billRef,
                result['batchListsContainer'].toProcess[i].nickname,
                result['batchListsContainer'].toProcess[i].amount,
                result['batchListsContainer'].toProcess[i].amountPayment, //amountPaid?
                result['batchListsContainer'].toProcess[i].amountWithoutVat,
                result['batchListsContainer'].toProcess[i].vatAmount,
                result['batchListsContainer'].toProcess[i].dueDate,
                result['batchListsContainer'].toProcess[i].statusCode,
                result['batchListsContainer'].toProcess[i].save,
                result['batchListsContainer'].toProcess[i].advanced,
                result['batchListsContainer'].toProcess[i].addDescriptionEn,
                result['batchListsContainer'].toProcess[i].addDescriptionAr,
                result['batchListsContainer'].toProcess[i].applyVat,
                result['batchListsContainer'].toProcess[i].partial,
                result['batchListsContainer'].toProcess[
                  i
                ].futureSecurityLevelsDTOList,
              )
              this.billsSelected.push(bill)
            }
            for (
              let i = 0;
              i < result['batchListsContainer'].toAuthorize.length;
              i++
            ) {
              const bill = new BillPayment(
                result['batchListsContainer'].toAuthorize[
                  i
                ].billPaymentDetailsPk,
                result['batchListsContainer'].toAuthorize[i].billerName,
                result['batchListsContainer'].toAuthorize[i].billRef,
                result['batchListsContainer'].toAuthorize[i].nickname,
                result['batchListsContainer'].toAuthorize[i].amount,
                result['batchListsContainer'].toAuthorize[i].amountPayment, // amountPaid?
                result['batchListsContainer'].toAuthorize[i].amountWithoutVat,
                result['batchListsContainer'].toAuthorize[i].vatAmount,
                result['batchListsContainer'].toAuthorize[i].dueDate,
                result['batchListsContainer'].toAuthorize[i].statusCode,
                result['batchListsContainer'].toAuthorize[i].save,
                result['batchListsContainer'].toAuthorize[i].advanced,
                result['batchListsContainer'].toAuthorize[i].addDescriptionEn,
                result['batchListsContainer'].toAuthorize[i].addDescriptionAr,
                result['batchListsContainer'].toAuthorize[i].applyVat,
                result['batchListsContainer'].toAuthorize[i].partial,
                result['batchListsContainer'].toAuthorize[
                  i
                ].futureSecurityLevelsDTOList,
              )
              this.billsSelected.push(bill)
            }
            //console.log(this.billsSelected);
            this.totalAmounts = result.total
            this.generateChallengeAndOTP = result['generateChallengeAndOTP']
            this.requestValidate = new RequestValidate()
            this.payBillsView = true
            this.wizardStep = this.wizardStep + 1
            this.getAllTables()
          }
        })
    }
  }

  finalizePayBills() {
    this.billPaymentService
      .payBills(
        this.batchListsContainer,
        this.generateChallengeAndOTP,
        this.requestValidate,
      )
      .subscribe((result) => {
        this.statusOk = true
        if (!result.error) {
          this.data = result
          if (this.data.billPayProcessList.length < 5) {
            for (let i = 0; i < this.data.billPayProcessList.length; ++i) {
              if (this.data.billPayProcessList[i].returnCode != '000') {
                this.statusOk = false
              }
            }
          }
          this.deleteBill = false
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.wizardStep = 3
          this.getAllTables()
        }
      })
  }

  finalizeDeleteBills() {
    this.billPaymentService
      .deleteBills(
        this.selectedAccount,
        this.tableSelected,
        this.generateChallengeAndOTP,
        this.requestValidate,
      )
      .subscribe((result) => {
        this.statusOk = true
        if (!result.error) {
          this.deleteBill = true
          this.wizardStep = 3
          this.getAllTables()
        }
      })
  }

  deleteBills() {
    if (this.tableSelected && this.tableSelected.length > 0) {
      this.billsSelected = []
      for (let i = 0; i < this.tableSelected.length; i++) {
        const bill = new BillPayment(
          this.tableSelected[i].billPaymentDetailsPk,
          this.tableSelected[i].billerName,
          this.tableSelected[i].billRef,
          this.tableSelected[i].nickname,
          this.tableSelected[i].amount,
          this.tableSelected[i].amountPaid,
          this.tableSelected[i].amountWithoutVat,
          this.tableSelected[i].vatAmount,
          this.tableSelected[i].dueDate,
          this.tableSelected[i].statusCode,
          this.tableSelected[i].save,
          this.tableSelected[i].advanced,
          this.tableSelected[i].addDescriptionEn,
          this.tableSelected[i].addDescriptionAr,
          this.tableSelected[i].applyVat,
          this.tableSelected[i].partial,
          this.tableSelected[i].futureSecurityLevelsDTOList,
        )
        this.billsSelected.push(bill)
      }

      this.payBillsView = false
      this.wizardStep = this.wizardStep + 1
      this.getAllTables()
    }
  }

  searchTypeChange($event: any = null) {
    this.searchForm.get('group').disable()
    this.searchForm.get('billCode').disable()
    this.searchForm.get('billRef').disable()
    this.searchForm.get('billNickName').disable()
    this.searchForm.get('billAmountFrom').disable()
    this.searchForm.get('billAmountTo').disable()
    this.searchForm.get('billDateFrom').disable()
    this.searchForm.get('billDateTo').disable()

    switch (this.searchForm.get('searchType').value) {
      case 'billCode':
        this.searchForm.get('group').enable()
        this.searchForm.get('billCode').enable()

        this.searchForm.get('billRef').setValue(null)
        this.searchForm.get('billNickName').setValue(null)
        this.searchForm.get('billAmountFrom').setValue(null)
        this.searchForm.get('billAmountTo').setValue(null)
        this.searchForm.get('billDateFrom').setValue(null)
        this.searchForm.get('billDateTo').setValue(null)

        this.billDateFrom = new Date()
        this.billDateTo = new Date()

        if (this.popoverBillDateTo) {
          this.popoverBillDateTo.hide()
        }
        if (this.popoverBillDateFrom) {
          this.popoverBillDateFrom.hide()
        }
        break
      case 'billRef':
        this.searchForm.get('billRef').enable()

        this.searchForm.get('group').setValue(null)
        this.searchForm.get('billCode').setValue(null)
        this.searchForm.get('billNickName').setValue(null)
        this.searchForm.get('billAmountFrom').setValue(null)
        this.searchForm.get('billAmountTo').setValue(null)
        this.searchForm.get('billDateFrom').setValue(null)
        this.searchForm.get('billDateTo').setValue(null)

        this.billDateFrom = new Date()
        this.billDateTo = new Date()

        if (this.popoverBillDateTo) {
          this.popoverBillDateTo.hide()
        }
        if (this.popoverBillDateFrom) {
          this.popoverBillDateFrom.hide()
        }
        break
      case 'nickName':
        this.searchForm.get('billNickName').enable()

        this.searchForm.get('group').setValue(null)
        this.searchForm.get('billCode').setValue(null)
        this.searchForm.get('billRef').setValue(null)
        this.searchForm.get('billAmountFrom').setValue(null)
        this.searchForm.get('billAmountTo').setValue(null)
        this.searchForm.get('billDateFrom').setValue(null)
        this.searchForm.get('billDateTo').setValue(null)

        this.billDateFrom = new Date()
        this.billDateTo = new Date()

        if (this.popoverBillDateTo) {
          this.popoverBillDateTo.hide()
        }
        if (this.popoverBillDateFrom) {
          this.popoverBillDateFrom.hide()
        }
        break
      case 'amount':
        this.searchForm.get('billAmountFrom').enable()
        this.searchForm.get('billAmountTo').enable()

        this.searchForm.get('group').setValue(null)
        this.searchForm.get('billCode').setValue(null)
        this.searchForm.get('billRef').setValue(null)
        this.searchForm.get('billNickName').setValue(null)
        this.searchForm.get('billDateFrom').setValue(null)
        this.searchForm.get('billDateTo').setValue(null)

        this.billDateFrom = new Date()
        this.billDateTo = new Date()

        if (this.popoverBillDateTo) {
          this.popoverBillDateTo.hide()
        }
        if (this.popoverBillDateFrom) {
          this.popoverBillDateFrom.hide()
        }
        break
      case 'date':
        this.searchForm.get('billDateFrom').enable()
        this.searchForm.get('billDateTo').enable()

        this.searchForm.get('group').setValue(null)
        this.searchForm.get('billCode').setValue(null)
        this.searchForm.get('billRef').setValue(null)
        this.searchForm.get('billNickName').setValue(null)
        this.searchForm.get('billAmountFrom').setValue(null)
        this.searchForm.get('billAmountTo').setValue(null)
        break
      default:
        this.searchForm.get('group').setValue(null)
        this.searchForm.get('billCode').setValue(null)
        this.searchForm.get('billRef').setValue(null)
        this.searchForm.get('billNickName').setValue(null)
        this.searchForm.get('billAmountFrom').setValue(null)
        this.searchForm.get('billAmountTo').setValue(null)
        this.searchForm.get('billDateFrom').setValue(null)
        this.searchForm.get('billDateTo').setValue(null)
        this.billDateFrom = new Date()
        this.billDateTo = new Date()
        break
    }
  }

  ngOnInit() {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.selectedAccount = null
    //this.getAccounts();
    this.searchForm.get('searchType').setValue('billCode')
    this.searchTypeChange(null)
    this.searchFilterData = Object.assign({}, this.searchForm.value)
    this.wizardStep = 1
    this.setPage(null)
    this.getBillCodes()
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  ngOnDestroy() {
    if (this.tableSuscription) {
      this.tableSuscription.unsubscribe()
    }
  }

  updateTableValue(event, cell, cellValue, row, rowIndex) {
    var aux:string = event.target.value.toString()
    if(cell==='amount'){
      if(aux.includes(",")){
        aux = aux.replace(',','')
        event.target.value = parseFloat(aux).toFixed(2)
      }
      
    }
    this.tablePage.data[rowIndex][cell] = event.target.value
  }

  updateNickName(event, row) {
    const newNickname = event.target.previousElementSibling.value
    // const nickname = row.nickName;
    // const amountPaid = row.updatedAmount;
    // const billCode = row.billerName;
    // const billRef = row.billRef;

    this.billPaymentService
      .updateNickname(newNickname, row)
      .subscribe((result) => {
        // if (!result.error) {
        //   event.target.previousElementSibling.value = newNickname;
        // } else {
        //   row.nickName = newNickname;
        // }
      })
  }

  /*getBill() {
        return this.billCodes;
    }*/

  /*
    searchBill(term: any) {
        this.search = [];
        this.getBill().filter((bill) => {
            const indexEn = bill.detailsDescriptionEn
                .toLowerCase()
                .indexOf(term.toLowerCase());
            const indexAr = bill.detailsDescriptionAr
                .toLowerCase()
                .indexOf(term.toLowerCase());
            if ((indexEn != -1 || indexAr != -1) && bill['status'] == true) {
                this.search.push(bill);
            }
        });
    }*/

  /*changeBillCode(index) {
        this.searchForm.get('billCode').setValue(this.search[index]);
    }*/

  next() {
    this.wizardStep = this.wizardStep + 1
    this.getAllTables()
  }

  returnToBillList() {
    this.wizardStep = 1
    this.getAllTables()
  }

  /*changeDateFrom(event) {
        if (this.searchForm.get('searchType').value == 'date') {
            if (this.openFromCalendar && this.searchForm.get('billDateFrom').value != null) {
                this.popoverBillDateFrom.hide();
                this.openFromCalendar = false;
            } else {
                this.popoverBillDateFrom.show();
                this.openFromCalendar = true;
            }
        }
    }*/

  /*showDateFrom(event) {
        if (this.searchForm.get('searchType').value == 'date') {
            this.popoverBillDateFrom.show();
        }
    }*/

  /*hideDateFrom(event) {
        if (this.searchForm.get('searchType').value == 'date') {
            this.popoverBillDateFrom.hide();
        }
    }*/

  /*changeDateTo(event) {
        if (this.searchForm.get('searchType').value == 'date') {
            if (this.openToCalendar && this.searchForm.get('billDateTo').value != null) {
                this.popoverBillDateTo.hide();
                this.openToCalendar = false;
            } else {
                this.popoverBillDateTo.show();
                this.openToCalendar = true;
            }
        }
    }*/

  /*showDateTo(event) {
        if (this.searchForm.get('searchType').value == 'date') {
            this.popoverBillDateTo.show();
        }
    }*/

  /*hideDateTo(event) {
        if (this.searchForm.get('searchType').value == 'date') {
            this.popoverBillDateTo.hide();
        }
    }*/

  resetPage() {
    this.wizardStep = 1
    this.payBillsView = true
    this.tableSelected = []
    this.setPage(null)
  }

  reset() {
    this.searchForm.get('searchType').setValue(null)
    this.searchTypeChange(null)
    this.searchFilterSubmit()
  }

  isPending() {
    if (this.deleteBill) {
      return false
    }
    if (
      this.generateChallengeAndOTP &&
      (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
        this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
        this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }

  valid() {
    if (this.authorization) {
      return this.authorization.valid() && this.tableSelected.length > 0
    } else {
      return this.tableSelected.length > 0
    }
  }

  getId(row) {
    return row['billPaymentDetailsPk'] + row['billCode'] + row['billRef']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  disabledSubmmit(): boolean {
    return (
      !this.searchForm.valid ||
      this.searchForm.get('searchType').value == '' ||
      this.searchForm.get('searchType').value == null ||
      !this.amountValid()
    )
  }
}

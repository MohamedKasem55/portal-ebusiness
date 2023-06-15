import { Component, OnInit } from '@angular/core';
import {DatatableMobileComponent} from "../../../../../../../core/responsive/datatable-mobile.component";
import {TranslateService} from "@ngx-translate/core";
import {PagedData} from "../../../../../../Model/paged-data";
import {FormGroup} from "@angular/forms";
import {AccountVerifyListService} from "./account-verify-list.service";
import {Observable} from "rxjs";
import {ModelService} from "../../../../../../Components/common/model.service";
import {Router} from "@angular/router";

@Component({
  selector: 'arb-account-verify-list',
  templateUrl: './account-verify-list.component.html',
  styleUrls: ['./account-verify-list.component.scss']
})
export class AccountVerifyListComponent extends DatatableMobileComponent implements OnInit {

  pagedData: PagedData<any> = new PagedData<any>()
  pageSize: number = 10

  formModel: FormGroup
  statusValues

  initData = {
    pageSize: this.pageSize,
    offset: 0
  }


  constructor(
      public translate: TranslateService,
      public service: AccountVerifyListService,
      public modelService: ModelService,
      public router: Router
  ) {
    super();
    this.formModel = this.service.formModel
  }

  ngOnInit(): void {
    this.setPage(this.initData)
    this.getModel()
    this.translate.onLangChange.subscribe(result => {
      this.getModel()
      const data = {
        pageSize: this.pagedData.page.pageNumber,
        offset: this.pagedData.page.pageSize
      }
      this.setPage(data)
    })
  }

  setPage(page){
    this.pagedData.page.pageNumber = page.offset
    this.pagedData.page.pageSize = page.pageSize

    let baseParams = {
      maxRecs: page.pageSize,
      offset: ++page.offset
    }

    let params = {
      ...baseParams,
      ...(this.formModel.controls['status'].value) && {status: this.formModel.controls['status'].value},
    }

    this.service.listVerifiedAccounts(params).subscribe(result => {
      if(result && result.errorCode == '0'){
        const disclaimerText = this.getDisclaimerText()
        this.pagedData.page.totalElements = result?.recPgCtrlOut.matchedRecs
        this.pagedData.page.size = result?.recPgCtrlOut.sentRecs
        this.pagedData.data = result?.verifiedAccounts.map(account => {
          return {
            ...account,
            disclaimer: disclaimerText
          }
        })

      }
    })
  }

  setPageSize(size){
    this.pageSize = size
    const page = {
      pageSize: size,
      offset: 0
    }

    this.setPage(page)
  }

  setPageOffset(offset){
    const page = {
      pageSize: this.pageSize,
      offset: offset
    }

    this.setPage(page)
  }

  resetForm(){
    this.formModel.reset()
    this.pagedData.page.pageNumber = 0
    this.setPageOffset(0)
  }

  canFilter(){
    return this.formModel.valid
  }

  getModel() {
    const modelData = this.modelService.getModel(this.translate.currentLang, 'accountVerificationReqStatus');
    if (modelData instanceof Observable) {
      modelData.subscribe(result => {
        this.statusValues = result;
      })
    } else {
      this.statusValues = modelData;
    }
  }

  getDisclaimerText(): string{
    let text = "This result is only valid for the same day of inquiry"
    this.translate.get("saudiPayments.accountVerify.disclaimer").subscribe(result => {
      if(result){
        text = result
      }
    })

    return text
  }

  routeToNewRequest(){
    this.router.navigateByUrl('/companyadmin/saudi-payments/account-verification/new')
  }

  routeToDetails(messageId){
    this.router.navigateByUrl('/companyadmin/saudi-payments/account-verification/details', {state: {messageId: messageId}})
  }
}

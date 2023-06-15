import { Component, OnInit } from '@angular/core';
import {DocumentStatusService} from "./document-status.service";
import {DatatableMobileComponent} from "../../../../../core/responsive/datatable-mobile.component";
import {TranslateService} from "@ngx-translate/core";
import {PagedData} from "../../../../Model/paged-data";
import { Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {RequestNewDocumentService} from "../request-new-document/request-new-document.service";

@Component({
  selector: 'app-document-status',
  templateUrl: './document-status.component.html',
  styleUrls: ['./document-status.component.scss']
})
export class DocumentStatusComponent extends DatatableMobileComponent implements OnInit{

  pageSize: number = 20

  custDocsReqsData: PagedData<any> = new PagedData<any>()
  formModel: FormGroup

  isSearchPanelCollapsed: boolean = true
  docTypes: any = null
  custDocsReqStates: any = null
  initData = {
    pageSize: this.pageSize,
    offset: 0
  }
  accounts = []

  constructor(
      public service: DocumentStatusService,
      public requestNewDocumentService: RequestNewDocumentService,
      public translate: TranslateService,
      public router: Router
  ) {
    super();
    this.custDocsReqsData.page.pageSize = this.pageSize

    this.service.getCustDocsModels('custDocs').subscribe(result => {
      this.docTypes = result
    })
    this.service.getCustDocsModels('custDocsReqStates').subscribe(result => {
      this.custDocsReqStates = result
    })

    this.translate.onLangChange.subscribe(result => {
      this.service.getCustDocsModels('custDocs').subscribe(result => {
        this.docTypes = result
      })
      this.service.getCustDocsModels('custDocsReqStates').subscribe(result => {
        this.custDocsReqStates = result
      })
    })

    this.requestNewDocumentService.getSARAccounts().subscribe(result => {
      if(result.errorCode == '0'){
        this.accounts = result.listAlertsPermissionAccount
      }
    })

    this.formModel = this.service.buildFilterForm()
  }

  ngOnInit(): void {

    this.setPage(this.initData)
  }

  setPage(page){
    this.custDocsReqsData.page.pageNumber = page.offset

    let baseParams = {
      maxRecs: page.pageSize,
      offset: ++page.offset
    }

    let params = {
      ...baseParams,
      ...(this.formModel.controls['reqState'].value) && {reqState: this.formModel.controls['reqState'].value},
      ...(this.formModel.controls['docType'].value) && {docType: this.formModel.controls['docType'].value},
      ...( this.formModel.controls['requesterId'].value) && {requesterId: this.formModel.controls['requesterId'].value},
      ...(this.formModel.controls['accountNum'].value) && {accountNum: this.formModel.controls['accountNum'].value}
    }

    this.service.listCustDocRequests(params).subscribe(result => {
      if(result.errorCode == '0'){

        result.docsLst.forEach(doc => {
          doc.creationDate = new Date(doc.creationDate)
        })

        this.custDocsReqsData.data = result.docsLst
        this.custDocsReqsData.page.totalElements = result.recPgCtrlOut.matchedRecs
        this.custDocsReqsData.page.size = result.recPgCtrlOut.sentRecs
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

  viewDocumentStatusDetails(docReqStatus){
    this.router.navigateByUrl('/accounts/customerDocuments/viewDocumentStatusDetails', {
      state: {
        statusDetails: docReqStatus
      }
    })
  }

  isDownloadDisabled(statusDetails){
    return statusDetails.docReqStatus == '01' && (statusDetails.fileNetRef == null || statusDetails.fileNetRef == '') ||
        statusDetails.docReqStatus == '04'
  }

  resetForm(){
    this.formModel.reset()
    this.custDocsReqsData.page.pageNumber = 0
    this.setPageOffset(0)
  }

  selectAccount(account){
    if (account) {
      this.formModel.controls['accountNum'].patchValue(account?.fullAccountNumber)
    }
    else {
      this.formModel.controls['accountNum'].reset()
    }
  }

  canFilter(){
    return this.formModel.valid
  }
}

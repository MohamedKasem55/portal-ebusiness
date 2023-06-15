import {Injectable, Injector} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ModelService} from "../../../../Components/common/model.service";

@Injectable({
  providedIn: 'root'
})
export class RequestNewDocumentService extends AbstractService {

  BANK_CERTIFICATE_CODE = "01"
  ACCOUNT_STATEMENT_CODE = "02"
  IBAN_CERTIFICATE_CODE = "05"

  constructor(
      private injector: Injector,
      public config: ConfigResourceService,
      protected http: HttpClient,
      public fb: FormBuilder,
      public translateService: TranslateService
  ) {
    super(http, config);
  }

  getCustDocsModels(): Observable<any>{
    const data = {
      name: 'custDocs'
    }

    return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
        map((response: any) => {
          if (response.props) {
            const result = []
            for (const _prop in response.props) {
              if (_prop)
                result.push({ key: _prop, value: response.props[_prop] })
            }
            return result
          }
        }),
        catchError(this.handleError),
    )
  }

  buildBankCertificateForm(docType): FormGroup {
    return this.fb.group({
      acctNum: [null, Validators.required],
      docType: [docType, Validators.required],
      language: [null, Validators.required],
      amount: [0, Validators.required],
      currency: ['608', Validators.required],
      balanceDate: [null, Validators.required],
      reportedBalance: [true, Validators.required],
      nameOfCertificate: ['BankOfCertificate', Validators.required],
    })
  }

  buildAccountStatementForm(docType): FormGroup {
    return this.fb.group({
      acctNum: [null, Validators.required],
      docType: [docType, Validators.required],
      language: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      isHijriDate: [false, Validators.required],
    })
  }

  buildIBANCertificateForm(docType): FormGroup {
    return this.fb.group({
      acctNum: [null, Validators.required],
      docType: [docType, Validators.required],
      language: [null, Validators.required],
    })
  }

  custDocEligibility(docType: string): Observable<any>{
    return this.http.get(this.servicesUrl + `/custDocs/eligibilityInq/${docType}`).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  createCustDocRequest(data): Observable<any>{
    data = this.buildData(data)
    return this.http.post(this.servicesUrl + '/custDocs/createCustDocRequest', data).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  getSARAccounts(): Observable<any> {
    return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  buildData(formModel){
    switch (formModel.controls['docType'].value) {
      case this.BANK_CERTIFICATE_CODE:
        return this.buildBankCertificateData(formModel)
      case this.ACCOUNT_STATEMENT_CODE:
        return this.buildAccountStatementData(formModel)
      case this.IBAN_CERTIFICATE_CODE:
        return this.buildIBANCertificateData(formModel)
    }
  }

  buildBankCertificateData(formModel: FormGroup){
    return {
      acctNum: formModel.controls['acctNum'].value,
      docType: formModel.controls['docType'].value,
      language: formModel.controls['language'].value,
      amt: {
        amount: formModel.controls['amount'].value,
        currency: formModel.controls['currency'].value,
      },
      balanceDate: this.formatDate(formModel.controls['balanceDate'].value),
      reportedBalance: formModel.controls['reportedBalance'].value,
      nameOfCertificate: formModel.controls['nameOfCertificate'].value
    }
  }

  buildAccountStatementData(formModel: FormGroup){
    return {
      acctNum: formModel.controls['acctNum'].value,
      docType: formModel.controls['docType'].value,
      language: formModel.controls['language'].value,
      fromDate: this.formatDate(formModel.controls['fromDate'].value),
      toDate: this.formatDate(formModel.controls['toDate'].value),
      isHijriDate: formModel.controls['isHijriDate'].value
    }
  }

  buildIBANCertificateData(formModel: FormGroup){
    return {
      acctNum: formModel.controls['acctNum'].value,
      docType: formModel.controls['docType'].value,
      language: formModel.controls['language'].value,
    }
  }

  formatDate(date){

    const year = {year: 'numeric'}
    const month = {month: 'numeric'}
    const day = {day: 'numeric'}

    return `${date.toLocaleDateString('en-US', year)}-${date.toLocaleDateString('en-US', month)}-${date.toLocaleDateString('en-US', day)}`
  }
}

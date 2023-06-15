import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { catchError, map } from 'rxjs/operators'
import {HttpClient, HttpParams} from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { SimpleMQ } from 'ng2-simple-mq'

import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { AbstractService } from 'app/Application/Modules/Common/Services/Abstract/abstract.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { FinanceProductCodeService } from '../../finance-product-code.service'


@Injectable()
export class FinanceProductNewRequestService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected fb: FormBuilder,
    private smq: SimpleMQ,
    private financeProductCode: FinanceProductCodeService,
  ) {
    super(http, config)
  }

  public createIniatForm(data): FormGroup {
    return this.fb.group({
      initiationDate: [
        new Date(data.startDateInfo.timestamp),
        [Validators.required],
      ],
      financingAmount: [data.financingAmt, [Validators.required, Validators.min(1), Validators.max(data.financingAmt)]],
      profitRate: [data.profitRate + '%', []],
      fees: [data.feesPercentage + '%', []],
      repaymentPeriod: [data.rePymtPeriod, [Validators.required]],
      installmentAmt: [data.installmentAmt, [Validators.required]],
      termsAccept: [false, [Validators.required]],
      dossierId: [null, []],
    })
  }

  public createInformationForm(data, productCode): FormGroup {
    let currentYear: any = { isValid: false }
    let lastYear: any = { isValid: false }
    let previousYear: any = { isValid: false }

    if (data.posBusinessDataDtls.keyFinancialInfo) {
      data.posBusinessDataDtls.keyFinancialInfo.forEach((element) => {
        switch (element.years) {
          case 1:
            currentYear = element
            break
          case 2:
            lastYear = element
            break
          case 0:
            previousYear = element
            break
        }
      })
    }
    return this.fb.group({
      account: [
        { value: data.posBusinessDataDtls.accountNumber, disabled: false },
        [Validators.required],
      ],
      numberOfBusiness: [
        { value: data.posBusinessDataDtls.businessOutletsNum, disabled: false },
        [Validators.required],
      ],
      typeOfBusiness: [
        {
          value: data.posBusinessDataDtls.businessOutletsType,
          disabled: false,
        },
        [Validators.required],
      ],
      patternDescription: [
        {
          value: data.posBusinessDataDtls.businessModelSalesDesc,
          disabled: false,
        },
        [Validators.required],
      ],
      locationOfBusiness: [
        { value: data.posBusinessDataDtls.businessLocation, disabled: false },
        [Validators.required],
      ],

      c_fullYearAccount: currentYear.fullYearAcct
        ? [{ value: currentYear.fullYearAcct, disabled: true }, []]
        : [{ value: null, disabled: false }, []],
      c_fromDate: currentYear.fromDate
        ? [{ value: new Date(currentYear.fromDate), disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      c_toDate: currentYear.toDate
        ? [{ value: new Date(currentYear.toDate), disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      c_accountType: currentYear.acctType
        ? [{ value: currentYear.acctType, disabled: true }, []]
        : [{ value: null, disabled: false }, productCode == "financeProduct.posFinance" ? [Validators.required] : []],
      c_salesTurnover: currentYear.salesTurnOver
        ? [{ value: currentYear.salesTurnOver, disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      c_grossProfit: currentYear.grossProfit
        ? [{ value: currentYear.grossProfit, disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      c_netProfit: currentYear.netProfit
        ? [{ value: currentYear.netProfit, disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],

      l_fromDate: lastYear.fromDate
        ? [{ value: new Date(lastYear.fromDate), disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      l_toDate: lastYear.toDate
        ? [{ value: new Date(lastYear.toDate), disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      l_accountType: lastYear.acctType
        ? [{ value: lastYear.acctType, disabled: true }, []]
        : [{ value: null, disabled: false }, productCode == "financeProduct.posFinance" ? [Validators.required] : []],
      l_salesTurnover: lastYear.salesTurnOver
        ? [{ value: lastYear.salesTurnOver, disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      l_grossProfit: lastYear.grossProfit
        ? [{ value: lastYear.grossProfit, disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],
      l_netProfit: lastYear.netProfit
        ? [{ value: lastYear.netProfit, disabled: true }, []]
        : [{ value: null, disabled: false }, [Validators.required]],

      p_fromDate: previousYear.fromDate
        ? [{ value: new Date(previousYear.fromDate), disabled: true }, []]
        : [{ value: null, disabled: false },productCode == "financeProduct.posFinance"? [Validators.required] :[]],
      p_toDate: previousYear.toDate
        ? [{ value: new Date(previousYear.toDate), disabled: true }, []]
        : [{ value: null, disabled: false }, productCode == "financeProduct.posFinance"? [Validators.required]: []],
      p_accountType: previousYear.acctType
        ? [{ value: previousYear.acctType, disabled: true }, []]
        : [{ value: null, disabled: false }, productCode == "financeProduct.posFinance"? [Validators.required]: []],
      p_salesTurnover: previousYear.salesTurnOver
        ? [{ value: previousYear.salesTurnOver, disabled: true }, []]
        : [{ value: null, disabled: false }, productCode == "financeProduct.posFinance"? [Validators.required]: []],
      p_grossProfit: previousYear.grossProfit
        ? [{ value: previousYear.grossProfit, disabled: true }, []]
        : [{ value: null, disabled: false }, productCode == "financeProduct.posFinance"? [Validators.required]: []],
      p_netProfit: previousYear.netProfit
        ? [{ value: previousYear.netProfit, disabled: true }, []]
        : [{ value: null, disabled: false }, productCode == "financeProduct.posFinance"? [Validators.required]: []],
    })
  }

  public initiate(productCode) {
    const data = { financeProductCode: productCode }
    return this.http.post(this.servicesUrl + '/finance/initiate', data).pipe(
      map((response: any) => {
        if (response.errorCode !== '0' && response.errorList) {
          if (response.errorList.includes('CR Number expired')) {
            return 'CR_NUMBER_EXPIRED'
          }
          return null
        } else {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }
      }),
    )
  }

  public validateInitialOffer(requestValidate: RequestValidate, productCode) {
    const data = {
      financeProductCode: productCode, requestValidate,
    }
    return this.http
      .post(this.servicesUrl + '/finance/validateInitialOffer', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }
  public reCalculate(rePymtPeriod: any, requiredAmt: any, productCode) {
    const data = {
      financeProductCode: productCode,
      rePymtPeriod,
      requiredAmt,
    }
    return this.http.post(this.servicesUrl + '/finance/reCalculate', data).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }

  public getCustomerData(productCode) {
    return this.http.get(this.servicesUrl + '/finance/customerData'+ (productCode != this.financeProductCode.POS_PRODUCT_CODE() ? '/' + productCode : '')).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }

  public getMandatoryDocuments(productCode) {
    return this.http
      .get(this.servicesUrl + '/finance/mandatoryDocuments/' + productCode)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public confirmOpenDossier(data) {
    return this.http
      .post(this.servicesUrl + '/finance/confirmOpenDossier', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public getModel(name) {
    return this.http.post(this.servicesUrl + '/statics/model', { name }).pipe(
      map((response: any) => {
        if (!response.props) {
          return []
        } else {
          return this.keyValueList(response.props)
        }
      }),
    )
  }

  public getList(names) {
    return this.http.post(this.servicesUrl + '/statics/list', { names }).pipe(
      map((response: any) => {
        if (!response) {
          return []
        } else {
          let result = []
          response.forEach(element => {
            result.push({ key: element.name, value: this.keyValueList(element.props) })
          })
          return result
        }
      }),
    )
  }

  private keyValueList(items) {
    let result = []
    Object.keys(items).forEach(function(key) {
      result.push({ key, value: items[key] })
    })
    return result
  }

  public attachDocument(doessierId, documentCode, file, dataURL) {
    let data = {
      doessierId,
      documentCode,
      fileName: file.name,
      fileType: file.type,
      fileContent: dataURL,
    }
    return this.http.post(this.servicesUrl + '/finance/attachDocument', data)
  }

  public convertFileToURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  }

  public getPDFFile(file, fileName) {
    const output = {
      file: new Blob(),
      fileName: file,
    }

    return this.http
      .get(this.config.getDocumentUrl() + '/' + file, {
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          output.file = res
          output.fileName = fileName
          return output
        }),
        catchError((): Observable<any> => {
          this.smq.publish(
            'error-mq',
            'Document Not Found',
          )
          return null
        }),
      )
  }

}

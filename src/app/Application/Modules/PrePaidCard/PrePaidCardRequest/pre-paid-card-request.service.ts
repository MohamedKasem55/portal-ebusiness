import {HttpClient, HttpResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Exception} from 'app/Application/Model/exception'
import {ConfigResourceService} from 'app/core/config/config.resource.local'
import {Observable, throwError as observableThrowError} from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import {
    PrepaidCardAttachment,
    PrepaidCardRequestConfirm,
    PrepaidCardsRequestValidate,
    RequestPrepaidCardValidateResponse,
    UserJourney,
} from './PrepaidCardRequestModel'
import {GenericResponse} from 'app/Application/Model/app.response'
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {CommonValidators} from "../../Common/constants/common-validators.service";
import {StaticService} from "../../Common/Services/static.service";

@Injectable({
    providedIn: 'root',
})
export class PrePaidCardRequestService {
    private servicesUrl = this.config.getServicesUrl()

    constructor(private http: HttpClient,
                private fb: FormBuilder,
                public commonValidators: CommonValidators,
                public staticService: StaticService,
                public config: ConfigResourceService) {
    }

    public switchForm(type: UserJourney){
        switch (type) {
            case UserJourney.EMPLOYEE:
                return this.fb.group({
                    companyEmbossingName: new FormControl('', [Validators.required, Validators.pattern(this.commonValidators.ONLY_ENGLISH_WITH_SPACE)]),
                    ownerEmbossingName: new FormControl(''),
                    holderFirstName: new FormControl('', [Validators.required, Validators.pattern(this.commonValidators.nameValidatorPattern)]),
                    holderLastName: new FormControl('', [Validators.required, Validators.pattern(this.commonValidators.nameValidatorPattern)]),
                    gender: new FormControl('', [Validators.required]),
                    dataOfBirth: new FormControl('', [Validators.required]),
                    national_id: new FormControl('', [Validators.required, this.commonValidators.getValidatorForSAID, Validators.pattern('^[0-9]*$')]),
                    memberPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(this.commonValidators.mobileNumberValidatorPattern)]),
                    nationality: new FormControl('', [Validators.required]),
                    city: new FormControl('', [Validators.required]),
                    account: new FormControl('', [Validators.required]),
                    id_iqamaAttach: new FormControl('', [Validators.required]),
                    empCertificateAttach: new FormControl('', [Validators.required]),
                    termsAndConditions: new FormControl('', [Validators.requiredTrue]),
                })
            case UserJourney.OWNER:
                return this.fb.group({
                    companyEmbossingName: new FormControl(null),
                    ownerEmbossingName: new FormControl(null),
                    holderFirstName: new FormControl(null),
                    holderLastName: new FormControl(null),
                    gender: new FormControl(null),
                    dataOfBirth: new FormControl(null),
                    national_id: new FormControl(null),
                    memberPhoneNumber: new FormControl(null),
                    nationality: new FormControl(null),
                    city: new FormControl(null),
                    account: new FormControl(null, [Validators.required]),
                    companyCR: new FormControl(null),
                    termsAndConditions: new FormControl(null, [Validators.requiredTrue]),
                })
        }
    }

    public getOwnerData(){
        return this.http
            .get(this.servicesUrl + '/prepaidCards/requestNew/ownerData')
            .pipe(
                map((response: any) => {
                    const body = response
                    if (response.errorCode !== '0') {
                        return new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                    } else {
                        return body
                    }
                }),
                catchError(this.handleError),
            )
    }

    public validatePrepaidCardNewRequest(request: PrepaidCardsRequestValidate): Observable<RequestPrepaidCardValidateResponse> {
        return this.http
            .post(this.servicesUrl + '/prepaidCards/requestNew/validate', request)
            .pipe(
                map((response: any) => {
                    const body = response
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return exception
                    } else {
                        const output = body
                        return output
                    }
                }),
                catchError(this.handleError),
            )
    }

    public confirmPrepaidCardNewRequest(request: PrepaidCardRequestConfirm): Observable<any> {
        return this.http
            .post(this.servicesUrl + '/prepaidCards/requestNew/confirm', request)
            .pipe(
                map((response: any) => {
                   return response
                }),
            )
    }

    public checkEligibility(): Observable<any> {
        return this.http
            .get(this.servicesUrl + '/prepaidCards/requestNew/eligibility')
    }

    public submitDocuments(request: PrepaidCardAttachment): Observable<GenericResponse> {
        return this.http.post(this.servicesUrl + '/prepaidCards/requestNew/attachDoc', request)
            .pipe(map((response: any) => {
                    const body = response
                    if (response.errorCode !== '0') {
                        const exception: Exception = new Exception(
                            body.errorCode,
                            body.errorDescription,
                        )
                        return exception
                    } else {
                        const output = body
                        return output
                    }
                }),
                catchError(this.handleError),
            )
    }


    public getSarAccounts(): Observable<any> {
        return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
            map((response: any) => {
                const body = response
                if (response.errorCode !== '0') {
                    const exception: Exception = new Exception(
                        body.errorCode,
                        body.errorDescription,
                    )
                    return observableThrowError(exception)
                } else {
                    const output = body.listAlertsPermissionAccount
                    return output
                }
            }),
            catchError(this.handleError),
        )
    }

    public handleError(error: HttpResponse<any> | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string
        if (error instanceof HttpResponse) {
            const err = error['error'] || JSON.stringify(error)
            errMsg = `${error.status} - ${error.statusText || ''}${err}`
        } else {
            errMsg = error.message ? error.message : error.toString()
        }

        const errorService: Exception = new Exception('handle', errMsg)
        return observableThrowError(errorService)
    }

    get termsConditions(): string {
        return `${this.config.getDocumentUrl()}/Terms-and-Conditions-of-Issuing-Business-Prepaid-Card.pdf`
    }
}

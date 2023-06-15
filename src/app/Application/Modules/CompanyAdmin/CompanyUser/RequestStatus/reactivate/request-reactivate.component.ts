import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { RequestStatusService } from "../request-status.service";
import { RequestReactivateStep1Component } from "./request-reactivate-step1.component";
import { RequestReactivateStep2Component } from "./request-reactivate-step2.component";
import { RequestReactivateService } from "./request-reactivate.service";
import { ResponseGenerateChallenge } from "app/Application/Model/responsegeneratechallenge.type";
import { RequestValidate } from "app/Application/Model/requestvalidateType";
import { StopPaymentService } from "app/Application/Modules/ChequebookManagement/stopPayment/stop-payment.service";
import { BusinessCardsList } from "app/Application/Modules/CommercialCards/commercial-cards-models";
import { StorageService } from "app/core/storage/storage.service";
import { CommercialCardsService } from "app/Application/Modules/CommercialCards/commercial-cards.service";
import { Exception } from "app/Application/Model/exception";
import { CompanyAdminUserManagementEditFormService } from "app/Application/Modules/Common/Components/CompanyAdmin/CompanyUser/UserForm/company-admin-user-management-edit-form.service";
import { UserDetails } from "../../../Model/userDetails";

@Component({
    selector: "app-request-reactivate",
    templateUrl: "./request-reactivate.component.html",
    styleUrls: ["./request-reactivate.component.scss"]
})
export class RequestReactivateComponent implements OnInit, OnDestroy {
    @ViewChild(RequestReactivateStep1Component)
    step1RequestReactivate: RequestReactivateStep1Component;
    @ViewChild(RequestReactivateStep2Component)
    step2RequestReactivate: RequestReactivateStep2Component;

    public step: number;
    public option = "initiate";
    public operation: string;
    public DeleteOption = "delete";
    public InitiateOption = "initiate";
    public subscriptions: Subscription[] = [];
    public mensajeError: any = {};
    public requestReactivate = {};
    public generateChallengeAndOTP: ResponseGenerateChallenge;
    public requestValidate: RequestValidate;
    public initiateBatch: any;
    public combosData: any = {}
    public userData: UserDetails;
    public dataForm: any;
    public formModel: FormGroup;
    public loaded = false;

    constructor(
        public service: RequestReactivateService,
        private fb: FormBuilder,
        private router: Router,
        public translate: TranslateService,
        public formService: CompanyAdminUserManagementEditFormService,
        private requestStatusService: RequestStatusService,
        public storage: StorageService,
    ) {
        this.step = 1;
        this.combosData['tokens'] = []
        this.requestValidate = new RequestValidate()
    }

    ngOnInit() {

        this.requestReactivate['initialBatch'] = this.requestStatusService.getUserDetails();
        this.service.getInit().subscribe((result: any) => {
            if (result instanceof Exception) {
                this.onError(result);
                this.option = null;
                return;
            } else {

                this.dataForm = result
                this.getDetails(this.requestReactivate['initialBatch'], this.dataForm)

            }
        })
    }

    getDetails(userBatch, dataForm) {
        this.subscriptions.push(this.service.getDetails(userBatch).subscribe((result: any) => {
            if (result instanceof Exception) {
                this.onError(result);
                this.option = null;
                return;
            } else {
                result.userBatch
                this.createForm(result.userBatch, dataForm);

            }
        }))

    }

    createForm(data, dataForm) {

        if (dataForm.unassignedHardSerialList.length > 0) {
            dataForm.unassignedHardSerialList.forEach(hardToken => {
                this.combosData['tokens'].push(
                    hardToken
                )
            });
        }

        if (dataForm.unassignedSoftSerialList.length > 0) {
            dataForm.unassignedSoftSerialList.forEach(softToken => {
                this.combosData['tokens'].push(
                    softToken
                )
            });
        }

        this.combosData['tokens'].push(data.serialNumberToken)

        // TODO
        if (data['vaPermisions']) {
            this.combosData['vaPermissions'] = []
            data['vaPermisions'].forEach(
                (p) => {
                    if (p['value'] === '-- Select one --') {
                        p['key'] = null
                    } else {
                        this.combosData['vaPermissions'].push(p)
                    }
                },
            )
        }

        data.tokenSerial = data.serialNumberToken;
        data.passDelivery = data.tokenPasswordDeliveryMethod;
        data.type = data.typeUser;
        this.userData = dataForm
        this.userData['companyUserDetails'] = data;
        this.userData['vaPermissions'] = data['vaPermisions'];

        const groups = []

        data.groups.forEach(group => {
            groups.push(group.groupId)
        });
        // this.userImage = this.selectedItem.userTemp.userImage

        if(data.status === 'R'){
            this.userData.backEndAccountPrivileges = data.backEndAccountPrivilegesDTO
        }
        this.userData.selectPrivilegeIndex = groups
        this.userData.accountList = data.accounts

        this.formModel = this.formService.createUserForm(
            this.userData,
            false,
        )
    }

    onInitStep1(events) {
        this.step1RequestReactivate = events;
    }

    onInitStep2(events) {
        this.step2RequestReactivate = events;
    }

    next() {
        switch (this.step) {
            case 1:
                this.initiate();
                break;
            case 2:
                if (this.option == this.InitiateOption) {
                    this.subscriptions.push(
                        this.service
                            .save(
                                this.step2RequestReactivate.batch,
                                this.step2RequestReactivate.requestValidate,
                            )
                            .subscribe((result) => {
                                if (result instanceof Exception) {
                                    this.onError(result);
                                    this.option = null;
                                    return;
                                } else {
                                    this.requestReactivate["initiate"] = result;
                                    this.nextStep();
                                }
                            })
                    );
                } else if (this.option == this.DeleteOption) {
                    this.subscriptions.push(
                        this.service.delete(this.initiateBatch).subscribe((result) => {
                            if (result instanceof Exception) {
                                this.onError(result);
                                this.option = null;
                                return;
                            } else {
                                this.nextStep();
                            }
                        })
                    );
                }
                break;
            case 3:
                this.nextStep();

                break;
        }
    }

    nextStep() {
        this.step = ++this.step % 4;
        if (this.step === 0) {
            this.step = 1;
            this.option = null;
        }
    }

    previous() {
        this.step = --this.step % 4;
        if (this.step === 0) {
            // this.step = 1;
            this.option = null;
            this.router.navigate(['/companyadmin/user/requeststatus']);
        }
    }

    isValidForm() {
        return this.step2RequestReactivate.valid();
    }

    isValidStep1Form() {
        return this.step1RequestReactivate.valid();
    }

    delete() {
        this.option = this.DeleteOption;
        this.initiateBatch = this.requestReactivate["initialBatch"];
        this.nextStep();
    }

    prepareData() {
        const data: any = {}
        this.prepareDataToValidate(data, this.formModel, this.userData,
            null)
        let userData: any
        userData = data.companyUser
        userData.serialNumberToken = (data.companyUser.tokenSerial ? data.companyUser.tokenSerial : null)
        userData.tokenPasswordDeliveryMethod = (data.companyUser.passwordDelivery ? data.companyUser.passwordDelivery : null)
        userData.typeUser = (data.companyUser.type ? data.companyUser.type : null)
        userData['accounts'] = data.listAccount
        userData['groups'] = data.selectedGroupList
        let userImage = {
            type: null,
            content: null
        }

        if (userData.userImage) {
            const image = data.companyUser.userImage.split(',')
            userImage = {
                type: image[0],
                content: image[1]
            }
        }

        userData['userImage'] = userImage
        userData['backEndAccountPrivilegesDTO'] = data.backEndAccountPrivileges
        userData.accessLimited = (data.companyUser.accessLimited == 'false' ? false : true)

        return data;
    }

    prepareDataToValidate(
        dataToValidate,
        formModel: FormGroup,
        userData,
        userPk
    ) {
        dataToValidate['typeOperation'] = userData?.companyUserDetails?.typeOperation ==='RG'? 'RG': 'MD'
        dataToValidate['profileNumber'] = null

        this.formService.setFormModelToData(
            dataToValidate,
            formModel,
            userData,
            userPk,
        )
    }

    initiate() {

        this.option = this.InitiateOption;
        const userData = this.prepareData()

        this.subscriptions.push(
            this.service
                .validate(
                    userData
                )
                .subscribe((result) => {
                    if (result instanceof Exception) {
                        this.onError(result);
                        this.option = null;
                        return;
                    } else {
                        this.initiateBatch = result.userBatch;
                        if (!this.initiateBatch.rejectedReason) {
                            this.initiateBatch = {
                                ...this.initiateBatch,
                                rejectedReason: this.requestReactivate['initialBatch'].rejectedReason
                            }
                        }
                        this.generateChallengeAndOTP = result.generateChallengeAndOTP;
                        this.nextStep();
                    }
                })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        this.subscriptions = [];
    }

    onError(error: any) {
        const res = error;
        this.mensajeError["code"] = res.errorCode;
        this.mensajeError["description"] = res.errorDescription;
    }

    finish() {
        this.step = 1;
        this.router.navigate(["/companyadmin/user/requeststatus"]);
    }
}

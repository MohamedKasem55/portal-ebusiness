import { ErrorGenerate } from "app/Application/Model/errorGenerate"
import { ResponseGenerateChallenge } from "app/Application/Model/responsegeneratechallenge.type";

export class ResponseValidateCompanyLimits extends ErrorGenerate {
    companyLimit: number;
}

export class RequestUpdateCompanyLimits {
    accountBatchList: AccountBatchList;
    requestValidate: any;
}

export class RequestValidateCompanyLimits {
    companyLimit: number;

}

export class AccountBatchList {
    companyLimit: number;
    resetPasswordPushNotification: boolean;
    vatNumber: string;
    companyWorkflowType: string;
}

export class RequestValidate extends ResponseGenerateChallenge { }
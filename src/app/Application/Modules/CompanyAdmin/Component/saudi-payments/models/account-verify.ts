import {RequestValidate} from "../../../../../Model/requestvalidateType";

export class AccountVerifyValidateReq {
    beneficiaryIban: string
    beneficiaryId: string
    remitterIban: string
    remitterFullAccountNumber: string
}

export class AccountVerifyConfirmReq {
    beneficiaryIban: string
    beneficiaryId: string
    remitterIban: string
    remitterFullAccountNumber: string
    requestValidate: RequestValidate
}
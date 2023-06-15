import {RequestValidate} from "../../../Model/requestvalidateType";

export class validateNewRegistrationReq {
    ibanNumber: string
}

export class confirmNewRegistrationReq {
    ibanNumber: string
    requestValidate: RequestValidate
}
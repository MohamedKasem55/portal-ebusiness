import {RequestValidate} from "../../../Model/requestvalidateType";

export class SellGoldConfirmReq {
    requestValidate: RequestValidate = new RequestValidate();
    referenceNumber: string;
    transactionKey: string;
}

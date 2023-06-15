import {RequestValidate} from "../../../../Model/requestvalidateType";

export class SingleCharityTransferConfirm{
    accountFrom: string;
    transferAmount: number;
    remarks: string;
    accountTo: string;
    requestValidate: RequestValidate;
}

export class SingleCharityList{

    maxRecs: number;
    offset: number;
    charityCategoryPk: number;
    charityGroupId: number;
}
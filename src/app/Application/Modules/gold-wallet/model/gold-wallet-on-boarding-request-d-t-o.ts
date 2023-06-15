import {RequestValidate} from "../../../Model/requestvalidateType";

export class GoldWalletOnBoardingRequestDTO {
    termsAndConditionAccepted: boolean;
    account: any;
    requestValidate: RequestValidate = new RequestValidate();
}

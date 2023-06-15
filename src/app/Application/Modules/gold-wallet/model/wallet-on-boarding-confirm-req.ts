import {RequestValidate} from "../../../Model/requestvalidateType";
import {Account} from "../../../Model/account";

export class WalletOnBoardingConfirmReq {
    linkedAccountDTO: Account = new Account();
    requestValidate: RequestValidate = new RequestValidate();
}

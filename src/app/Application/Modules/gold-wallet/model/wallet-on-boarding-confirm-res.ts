import {Account} from "../../../Model/account";

export class WalletOnBoardingConfirmRes {
    linkedAccountDTO: Account = new Account();
    walletId: string = "";
}

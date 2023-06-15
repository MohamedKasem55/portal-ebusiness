import {Account} from "../../../../Model/account";

export class ApplyMadaCard {
    account: Account;
    embossingName: string;
    acceptedTermsAndConditions: boolean;
    gender: string;
    branch: Branch;
    otp: any;
    step: number;
}

class Branch {
    code: string;
    branch: string;
    selected: boolean;
}
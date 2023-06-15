import {RequestValidate} from "../../../Model/requestvalidateType";
import {GoldWalletBullionRes} from "./gold-wallet-bullion-res";
import {BuyGoldValidateRes} from "./buy-gold-validate-res";
import {ResponseGenerateChallenge} from "../../../Model/responsegeneratechallenge.type";

export class GoldWalletBuyRequestDTO {
    termsAndConditionAccepted: boolean = false;
    requestedBullion: RequestedBullion = new RequestedBullion();
    buyGoldValidateRes: BuyGoldValidateRes = new BuyGoldValidateRes();
    requestValidate: RequestValidate = new RequestValidate();
    goldWalletBullionRes: GoldWalletBullionRes = new GoldWalletBullionRes();
    generateChallengeAndOTP: ResponseGenerateChallenge=new ResponseGenerateChallenge();
}

export class RequestedBullion {
    selectedBullion: number;
    custom: boolean = false;
}
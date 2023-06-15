import {RequestValidate} from "../../../Model/requestvalidateType";
import {GoldWalletDashboardRes} from "./gold-wallet-dashboard-res";
import {SellGoldValidateRes} from "./sell-gold-validate-res";

export class SellRequestDTO {
    dashboardObject: GoldWalletDashboardRes = new GoldWalletDashboardRes();
    sellGoldValidateRes: SellGoldValidateRes = new SellGoldValidateRes();
    requestValidate: RequestValidate = new RequestValidate();
    language:string;

}

import {BullionWeight} from "./gold-wallet-bullion-res";

export class BuyGoldValidateRes {
    referenceNumber: string;
    transactionKey: string;
    rate: string;
    goldVendor: string;
    timeToLive: string;
    totalCost: number;
    measureUnit: BullionWeight;
    weight: number;
    qty: number;
    purity: number;
    goldSource: string;
}
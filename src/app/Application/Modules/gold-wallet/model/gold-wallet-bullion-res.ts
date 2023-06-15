export class GoldWalletBullionRes {
    availableFreeWeight: MaxWeight = new MaxWeight();
    goldPrice: GoldPrice = new GoldPrice();
    timeToLive: string;
    gmbullionDtls: number[] = new Array<number>();
    kgbullionDtls: number[] = new Array<number>();
}

export class GoldPrice {
    arCurrency: string
    arMeasureUnit: string
    enCurrency: string
    enMeasureUnit: string
    goldBuyPrice: number
}

export class MaxWeight {
    balance: number;
    measureUnit: BullionWeight;
}

export class Bullion {
    weight: number;
    currency: BullionWeight;
}

export enum BullionWeight {
    GRAM = "GRAM", KG = "KG", GM = "GM"
}
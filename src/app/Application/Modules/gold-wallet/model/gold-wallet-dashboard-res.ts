export class GoldWalletDashboardRes {
    walletNum: string;
    linkedAccountNumber: string;
    goldBalance: GoldBalance = new GoldBalance();
    marketInformation: MarketInformation = new MarketInformation();
}

class GoldBalance {
    balance: string;
    measureUnit: MeasureUnit;
}

// eslint-disable-next-line no-shadow
enum MeasureUnit {
    GRAM, KG
}

class MarketInformation {
    marketPrice: string;
    sellPrice: string;
    buyPrice: string;
    marketOpened: boolean;
}
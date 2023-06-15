export class BaseTransactionList {
    myLastTransaction: PagedResultGoldDetails = new PagedResultGoldDetails();
}

export class GoldWalletTransactionsRes extends BaseTransactionList{
    myGold: PagedResultGoldDetails = new PagedResultGoldDetails();
}

export class SellTransactionsRes extends BaseTransactionList{
    myGoldFixed: PagedResultGoldDetails = new PagedResultGoldDetails();
    myGoldFree: PagedResultGoldDetails = new PagedResultGoldDetails();
}
export class PagedResultGoldDetails {
    size: number;
    total: number;
    items: GoldDetails[] = new Array<GoldDetails>();
}

export class GoldDetails {
    amount: number;
    costPrice: number;
    gain: number;
    goldCode: string;
    goldSource: string;
    purity: number;
    serialNumber: string;
    transactionDate: string;
    transactionStatus: string;
    transactionType: string;
    vendorName: string;
}


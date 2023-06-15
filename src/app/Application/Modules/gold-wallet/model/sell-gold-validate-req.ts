export class SellGoldValidateReq {
    walletId: string;
    bullionLst: BullionItem[] = new Array<BullionItem>()
    accountNumber: string;

}


export class BullionItem {
    goldCode: string
    weight: number
    customWeight: boolean
}
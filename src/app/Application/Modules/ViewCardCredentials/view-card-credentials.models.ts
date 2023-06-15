
export class CredentialsObject {
    image?: string;
    cardHolderName: string;
    expiryDate?: string;
    accountNumber: string;
    cvv?: string;
}

export class ViewCardCredentialsData extends CredentialsObject {
    routes?: any;
    title?: string;
    messageExpired: string;
    sourcePage: any;
    indexSelected?: number;
    imageType: string;
}

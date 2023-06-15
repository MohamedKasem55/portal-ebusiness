import { BatchSecurity } from "app/Application/Model/Batch/BatchSecurity"
import { ResponseGenerateChallenge } from "app/Application/Model/responsegeneratechallenge.type";
import { Account } from '../../../../../Model/account';
import { HostRequestDTO } from "app/Application/Modules/WPSPayroll/model/hostRequestDTO"

export class ResponseProcessedTransactionList {
    errorCode: string;
    errorDescriptio: string;
    errorResponse: any;
    generateChallengeAndOTP: ResponseGenerateChallenge;
    processedTransactionList: ProcessedTransactionList;
}

// tslint:disable-next-line: max-classes-per-file
export class ProcessedTransactionList {
    size: number;
    total: number;
    items: BillPaymentsBatch;
}
// tslint:disable-next-line: max-classes-per-file
export class BillPaymentsBatch {
    batchPk: number;
    type: string;
    status: string;
    beStatus: string;
    account?: Account;
    accountNumber: string;
    accountAlias: string;
    rejectedReason: string;
    initiationDate: string;
    hostRequest: HostRequestDTO;
    nextStatus: string;
    securityLevelsDTOList: BatchSecurity;
    futureSecurityLevelsDTOList: BatchSecurity;
    process: string;
    billCode: string;
    billRef: string;
    amountOriginal: number;
    amountPayment: number;
    nickname: string
    addDescriptionEn: string;
    addDescriptionAr: string;
    detailsDescriptionAr: string;
    paymentType: string;
    dueDate: string;
    vatAmount: number;
    amountWithoutVat: number;
    newAddBill: boolean;
    amount: number;
    pdfSecurityLevelsDTOList: BatchSecurity;
    futureStatus: string;
}
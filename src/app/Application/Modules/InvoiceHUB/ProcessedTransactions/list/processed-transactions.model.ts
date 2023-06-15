import { BatchSecurity } from "app/Application/Model/Batch/BatchSecurity"
import { ResponseGenerateChallenge } from "app/Application/Model/responsegeneratechallenge.type";
import { HostRequestDTO } from "app/Application/Modules/WPSPayroll/model/hostRequestDTO"
import { Account } from '../../../../Model/account';

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
    items: EsalPaymentsBatch;
}
// tslint:disable-next-line: max-classes-per-file
export class EsalPaymentsBatch {
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
    securityLevelsDTOList: BatchSecurity[];
    futureSecurityLevelsDTOList: BatchSecurity;
    sadadInvoiceBatchPk: number;
    invoiceId: string;
    invoiceCode: string;
    billCategory: string;
    billerId: string;
    billerName: string;
    buyerName: string;
    amountDue: number;
    amountPayment: number;
    currency: string;
    dateDue: string;
    billType: string;
    amountRangeFrom: number
    amountRangeTo: number
    additionalDetails: string;
    additionalDetailsAr: string;
    permission: string;
    returnCode: string;
    amount: number;
    pdfSecurityLevelsDTOList: BatchSecurity;
    futureStatus: string;
}
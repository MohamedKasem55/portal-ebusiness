export class LevelsDSOList {
    batchSecurityPk: number;
    level: number;
    status: string;
    updater: string;
    updateDate: string;
    userPk: number;
    auditStatus: string;
    pdfStatus: string;
}

export class BatchDSO {
    batchPk: number;
    type: string;
    status: string;
    accountNumber: string;
    accountAlias: string;
    rejectedReason: string;
    initiationDate: string;
    hostRequest: any;
    nextStatus: string;
    securityLevelsDTOList: LevelsDSOList[];
    futureSecurityLevelsDTOList: LevelsDSOList[];
    beStatus: string;
    tokenNumber: number;
    totalAmount: number;
    userPk: string;
    initiateBy: string;
    amount: number;
    futureStatus: string;
    pdfSecurityLevelsDTOList: LevelsDSOList [];
}
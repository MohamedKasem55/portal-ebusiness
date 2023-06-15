export class userEtrade {
    userEtradeFunctionsPk: number;
    etradeFunction: {
        etradeFunctionPk: number;
        functionId: string;
        active: boolean;
        descriptionAr: string;
        descriptionEn: string;
        status: string;
        process: string;
    };
    level: number;
    initiator: boolean;
}
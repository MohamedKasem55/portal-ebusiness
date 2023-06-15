export class eTradePrivilege {
    companyEtradeFunctionList: companyEtradeFunctionList[];
    companyEtradeParameter: companyEtradeParameter
}

export class companyEtradeFunctionList {
    selected: boolean;
    companyEtradeFunctionsPk: number;
    etradeFunction: etradeFunction;
    limit: number;
}

export class etradeFunction {
    etradeFunctionPk: number;
    functionId: string;
    active: boolean;
    descriptionAr: string;
    descriptionEn: string;
    status: string;
    process: string;
}

export class companyEtradeParameter {
    companyPk: number;
    currencyBase: string;
    ammountFormat: string;
    region: string;
    companyNameEn: string;
    companyNameAr: string;
    authorizeTransaction: boolean;
}
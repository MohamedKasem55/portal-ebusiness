export interface AgreementType {
    files: AgreementFile[],
    downLoadInstructions: string [],
}

interface AgreementFile {
    name: string,
    link: string
}

export class AppAgreementsConfig {

    cash24: AgreementType = {
        files: [{name: 'app_and_agreement.cash24', link: '/cash24-agreement.pdf'}],
        downLoadInstructions: ['app_and_agreement.instructions.cash24.instructions-1',
            'app_and_agreement.instructions.cash24.instructions-2',
            'app_and_agreement.instructions.cash24.instructions-3'],
    }

    ecommerce: AgreementType = {
        files: [{name: 'app_and_agreement.ecommerce', link: '/ecommerce-agreement.pdf'}],
        downLoadInstructions: ['app_and_agreement.instructions.ecommerce.instructions-1',
            'app_and_agreement.instructions.ecommerce.instructions-2',
            'app_and_agreement.instructions.ecommerce.instructions-3'],
    }

}



import {Injectable} from '@angular/core'
import {AbstractService} from 'app/Application/Modules/Common/Services/Abstract/abstract.service'
import {HttpClient} from '@angular/common/http'
import {ConfigResourceService} from 'app/core/config/config.resource.local'
import {FormBuilder} from '@angular/forms'
import {map} from 'rxjs/operators'
import {Observable, of} from 'rxjs'
import {FinanceProductCodeService} from '../../finance-product-code.service'
import {ProductDetails} from './models/request'
import {FinanceProductCode} from './enum/enum'

@Injectable({
    providedIn: 'root',
})
export class FinanceFleetNewReqService extends AbstractService {
    uploadedQuotation: [] = [];
    selectedInternalQuotationObj;
    selectedExternalQuotationObj;
    quotationEditIndex;
    fakeFile:string = "";

    constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
        protected fb: FormBuilder,
        private financeProductCode: FinanceProductCodeService,
    ) {
        super(http, config)
    }

    get purposeOfUse() {
        return [
            {txt: 'Commercial Vehicles 8 - 20 ton', id: 'MSB_FLEET_COM_13_TON'},
            {txt: 'Commercial Vehicles up to 8 ton', id: 'MSB_FLEET_COM_8TON'},
            {
                txt: 'Executive and Personal Use Vehicles',
                id: 'MSB_FLEET_PERSONAL_VEH',
            },
            {txt: 'Non-Commercial Vehicles', id: 'MSB_FLEET_NON_COM'},
            {txt: 'Rent a Car - Non-Commercial Vehicle', id: 'MSB_FLEET_COM_RENT'},
        ]
    }

    get colors() {
        return [
            {value: 'White', txt: 'fleet.colors.White'},
            {value: 'Black', txt: 'fleet.colors.Black'},
            {value: 'Red', txt: 'fleet.colors.Red'},
            {value: 'Yellow', txt: 'fleet.colors.Yellow'},
            {value: 'Grey', txt: 'fleet.colors.Grey'},
            {value: 'Blue', txt: 'fleet.colors.Blue'},
            {value: 'Brown', txt: 'fleet.colors.Brown'},
            {value: 'Silver', txt: 'fleet.colors.Silver'},
            {value: 'Gold', txt: 'fleet.colors.Gold'},
            {value: 'Green', txt: 'fleet.colors.Green'},
            {value: 'Beige', txt: 'fleet.colors.Beige'},
            {value: 'Maroon', txt: 'fleet.colors.Maroon'},
            {value: 'Purple', txt: 'fleet.colors.Purple'},
            {value: 'Orange', txt: 'fleet.colors.Orange'},
            {value: 'Pink', txt: 'fleet.colors.Pink'},
            {value: 'Khaki', txt: 'fleet.colors.Khaki'},
            {value: 'CactusGreen', txt: 'fleet.colors.CactusGreen'},
            {value: 'NotKnown', txt: 'fleet.colors.NotKnown'},
        ]
    }


    //===============================-CustomerDataAPI-=============================

    getCustomerData() {
        return this.http
            .get(
                this.servicesUrl + `/finance/customerData/${FinanceProductCode.Fleet}`,
            )
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-PreCheckAPI-=============================

    public validateEligibility() {
        const data = {
            financeProductCode:
                this.financeProductCode.FLEET_FINANCE_COMMERCIAL_VEHICLE(),
            resendOTP: true,
        }
        return this.http
            .post(this.servicesUrl + '/finance/fleet/preliminaryCheck', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-MandatoryDocsAPI-=============================

    public getMandatoryDocs() {
        return this.http
            .get(
                this.servicesUrl +
                '/finance/mandatoryDocuments/FLEET_FINANCE_COMMERCIAL_VEHICLE',
            )
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-VehiclesAPI-=============================

    getBrands() {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/vehicles/brands', {})
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-ModelsAPI-=============================

    getModelsBybrandName(brandName: string) {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/vehicles/brand/models', {
                brandName: brandName,
            })
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-VariantsAPI-=============================

    getVariantBybrandModel(brandName: string, modelName: string) {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/vehicles/model/segments', {
                brandName: brandName,
                modelName: modelName,
            })
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }
      
    //===============================-default-valuesAPI-=============================

    getDefaultValues(body) {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/default-values', body)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
        
    }

    //===============================-CustomerQuotationAPI-=============================

    uploadCustomerQuotation(quotation) {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/customer-quotations', quotation)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    
    //===============================-CustomerQuotationAPI-=============================

    uploadQuotationFile(quotationFile) {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/save-doc-temporary', quotationFile)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }
    //===============================-OpenDossierAPI-=============================

    openDossierRequest(data): Observable<any> {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/opendisburesmentfleet', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-dealersAPI-=============================

    getDealers() {
        return this.http
            .post(this.servicesUrl + '/finance/fleet/vehicles/dealers', {})
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //================================UploadDoc=======================
    uploadDocument(doessierId, documentCode, file, dataURL?,newFileName?) {
        let data = {
            doessierId: doessierId,
            documentCode: documentCode,
            fileName: (newFileName ? newFileName :  file?.name),
            fileType: file?.type,
            fileContent: dataURL,
        }
        return this.http.post(this.servicesUrl + '/finance/attachDocument', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }//===============================-CustomerBusinessDetails-=============================


    getCustomerBusinessDetails() {
        const data = {
            financeProductCode:
                this.financeProductCode.FLEET_FINANCE_COMMERCIAL_VEHICLE(),
        }
        return this.http
            .post(
                this.servicesUrl + `/finance/fleet/business/details`, data
            )
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-initialOfferInq-=============================
    getInitialOfferInq(data): Observable<any> {
        return this.http.post(this.servicesUrl + '/finance/fleet/customer/offer/inquiry', data)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }

    //===============================-customerAcceptance-=============================
    setFinalAgreementAcceptance(data): Observable<any> {
        return this.http.post(this.servicesUrl + `/finance/setFinalAgreementAcceptance/${data?.dossairID}`, data.body)
            .pipe(
                map((response: any) => {
                    if (response.errorCode !== '0') {
                        return null
                    } else {
                        return response
                    }
                }),
            )
    }


    public fileToBas64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result)
            }
        })
    }

    set QuotationIndex(index) {
        this.quotationEditIndex = index
    }

    get QuotationIndex() {
        return this.quotationEditIndex;
    }

    set Quotations(quotation) {
        this.uploadedQuotation = quotation;
    }

    get Quotations() {
        return this.uploadedQuotation;
    }

    searchPost(data) {
        return of(12123, 123)
    }

    set selectedInternalQuotation(internalQuotatoion) {
        this.selectedInternalQuotationObj = internalQuotatoion;
    }

    get selectedInternalQuotation() {
        return this.selectedInternalQuotationObj
    }

    setExternalQuotation(externalQuotatoion) {
        this.selectedExternalQuotationObj = externalQuotatoion;
    }

    getSelectedExternalQuotation() {
        return this.selectedExternalQuotationObj
    }

    setCurrentStep(stepNumber) {
        sessionStorage.setItem("currentStep", stepNumber);
    }

    get CurrentStep() {
        return sessionStorage.getItem("currentStep")
    }

    getAllBranches(page: any) {

        return of({
            data: [
                {
                    branchId: 1,
                    branchName: 'cairo branch',
                    branchCity: 'cairo',
                    branchCode: 1,
                },
                {
                    branchId: 2,
                    branchName: 'alex branch',
                    branchCity: 'alex',
                    branchCode: 2,
                },
                {
                    branchId: 3,
                    branchName: 'zagazig branch',
                    branchCity: 'zagazig',
                    branchCode: 3,
                },
                {
                    branchId: 4,
                    branchName: 'cairo4 branch',
                    branchCity: 'cairo4',
                    branchCode: 4,
                },
                {
                    branchId: 5,
                    branchName: 'alex5 branch',
                    branchCity: 'alex5',
                    branchCode: 5,
                },
                {
                    branchId: 6,
                    branchName: 'zagazig6 branch',
                    branchCity: 'zagazig6',
                    branchCode: 6,
                },
                {
                    branchId: 7,
                    branchName: 'cairo7 branch',
                    branchCity: 'cairo7',
                    branchCode: 7,
                },
                {
                    branchId: 8,
                    branchName: 'alex8 branch',
                    branchCity: 'alex8',
                    branchCode: 8,
                },
                {
                    branchId: 9,
                    branchName: 'zagazig9 branch',
                    branchCity: 'zagazig9',
                    branchCode: 9,
                },
            ],
            page: {
                size: 10,
                totalElements: 1,
                totalPages: 0.05,
                pageNumber: 1,
                pageSize: page.pageSize,
            },

        })
    }

    private keyValueList(items) {
        let result = []
        Object.keys(items).forEach(function (code) {
            result.push({code, branch: items[code]})
        })
        return result
    }

    getAllBranchesRes() {
        const data = {
            name: this.financeProductCode.ALL_BRANCHES(),
        }
        return this.http
            .post(
                this.servicesUrl + `/statics/model`, data
            ).pipe(
                map((response: any) => {
                    if (!response.props) {
                        return []
                    } else {
                        return this.keyValueList(response.props)
                    }
                }),
            )
    }

    getAllApplicationDetails(): Observable<ProductDetails> {
        return of(
            {
                accountNumber: "SA50 0000 0000 0000 9304",
                adminFee: "1%",
                dossierID: "1234567TRR",
                EinstDate: "13/02/2024",
                fianceAccount: "700,000.00 SR",
                finalInstAmount: "5,000.00 SR",
                financeTenure: "36 Months",
                FinstAmount: "5,000.00 SR",
                FinstDate: "13/02/2021",
                MDPay: ""

            }
        )
    }
    removeFleetSessionCache(){
        sessionStorage.removeItem("InQuotations")
        sessionStorage.removeItem("ExQuotations")
        sessionStorage.removeItem("businessDetails")
        sessionStorage.removeItem("documentUploadedVal")
        sessionStorage.removeItem("quotationDetails")
        sessionStorage.removeItem("amtDetails")
        sessionStorage.removeItem("accountNum")
        sessionStorage.removeItem("fleetLimit")
        sessionStorage.removeItem("dossairID")
    }


}
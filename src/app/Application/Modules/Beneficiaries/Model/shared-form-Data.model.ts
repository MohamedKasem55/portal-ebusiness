export class FormData {
  bankNames: any = []
  branchsNames: any = []
  countriesName: any = []
  //currencyList:any = [];
  currencyList: string[] = []
  bankNameTransform: string
  branchNameTransform: string
  branchCodeTransform: string
  countryTransform: string
  currencyTransform: string

  tmpCountry: any = []
  tmpCurrency: any = []
  tmpCountryDocID: any = []
  tmpPlaceBirth: any = []
  tmpNationality: any = []

  category: string
  contryText: string
  contryCode: string
  invalidIBAN: boolean
  bankIbanCode: string
  errorAccountValidation: boolean

  //Add internatinational beneficiary
  //BENEFICIARY BANK DETAIL
  country: string
  bankName: string
  branchName: string
  branchNameTypeText: string
  branchNameTypeCode: string
  currency: string
  currencyText: string
  currencyCode: string
  swiftCode: string
  bankAddress: string
  branchAddress: string
  //BENEFICIARY DETAIL
  beneficiaryAccount: string
  retypeBeneficiaryAccount: string
  firstName: string
  secondName: string
  middleName: string
  familyName: string
  dateBirth: Date
  dateBirthString: string
  placeBirth: string
  placeBirthText: string
  placeBirthCode: string
  beneficiaryMobileNumber: string
  emailBeneDetail: string
  //BENEFICIARY ADDRESS
  beneficiaryAddress1: string
  streetBuildingNumber: string
  beneficiaryAddress2: string
  postalCode: string
  countryAddress: any[] = []
  countryAddressText: string
  countryAddressCode: string
  poBox: string
  cityState: string
  //DOCUMENT ID
  individualIdType: string
  //idType:string;
  idTypeText: string
  idTypeCode: string
  idNumber: string
  issuedAt: string
  //idType:any[]= [];
  issueDate: Date
  countryIdType: string
  countryIdTypeText: string
  countryIdTypeCode: string
  //BENEFICIARY DETAIL COMPANY
  sortCode: string
  beneficiaryName: string
  nationality: string
  nationalityText: string
  nationalityTransform: string
  beneficiaryMobileNumberCompany: string
  prefix: string
  area: string
  number: string
  extension: string

  // REST OF ADD´S BENEFICIARIES
  account: string
  beneficiaryType: string
  phoneNumber: string
  email: string
  emailAlRajhi: string
  lastName: string
  name = ''
  idBeneficiary = '';
  nickName : string;

  deleteData() {
    this.bankNames = []
    this.branchsNames = []
    this.countriesName = []
    this.currencyList = []
    this.bankNameTransform = ''
    this.branchNameTransform = ''
    this.branchCodeTransform = ''
    this.countryTransform = ''
    this.currencyTransform = ''

    this.tmpCountry = []
    this.tmpCurrency = []
    this.tmpCountryDocID = []
    this.tmpPlaceBirth = []
    this.tmpNationality = []

    this.contryText = ''
    this.contryCode = ''
    this.invalidIBAN = false

    // RESET REST OF ADD´S BENEFICIARIES
    this.account = ''
    this.beneficiaryType = ''
    this.phoneNumber = ''
    this.email = ''
    this.emailAlRajhi = ''
    this.category = ''
    this.lastName = ''
    this.name = ''
    this.idBeneficiary = ''
    this.bankIbanCode = ''
    this.errorAccountValidation = false

    // RESET Add internatinational beneficiary
    //BENEFICIARY BANK DETAIL
    this.country = ''
    this.bankName = ''
    this.branchName = ''
    this.branchNameTypeText = ''
    this.branchNameTypeCode = ''
    this.currency = ''
    this.currencyText = ''
    this.currencyCode = ''
    this.swiftCode = ''
    this.bankAddress = ''
    this.branchAddress = ''
    //BENEFICIARY DETAIL
    this.beneficiaryAccount = ''
    this.retypeBeneficiaryAccount = ''
    this.firstName = ''
    this.secondName = ''
    this.middleName = ''
    this.familyName = ''
    this.dateBirth = null
    this.dateBirthString = ''
    this.placeBirth = ''
    this.placeBirthText = ''
    this.placeBirthCode = ''
    this.beneficiaryMobileNumber = ''
    this.emailBeneDetail = ''
    //BENEFICIARY ADDRESS
    this.beneficiaryAddress1 = ''
    this.streetBuildingNumber = ''
    this.beneficiaryAddress2 = ''
    this.postalCode = ''
    this.countryAddress = []
    this.countryAddressText = ''
    this.countryAddressCode = ''
    this.poBox = ''
    this.cityState = ''
    //DOCUMENT ID
    this.individualIdType = ''
    //this.idType = '';
    this.idTypeText = ''
    this.idTypeCode = ''
    this.idNumber = ''
    this.issuedAt = ''
    //this.idType = [];
    this.issueDate = null
    this.countryIdType = ''
    this.countryIdTypeText = ''
    this.countryIdTypeCode = ''
    //BENEFICIARY DETAIL COMPANY
    this.sortCode = ''
    this.beneficiaryName = ''
    this.nationality = ''
    this.nationalityText = ''
    this.nationalityTransform = ''
    this.beneficiaryMobileNumberCompany = ''
    this.prefix = ''
    this.area = ''
    this.number = ''
    this.extension = ''
  }
}

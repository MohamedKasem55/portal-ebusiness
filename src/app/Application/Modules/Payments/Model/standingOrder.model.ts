export class ModelStadingModel {
  mandateNumber: number
  accountFrom: string
  beneficiaryFullName: string
  option: string
  lastPaymentStatus: string
  lastPaymentDate: string
  successfulPaymentNumber: string
  failedPaymentNumber: string
  totalAmountPaid: string
  nextPaymentDate: string
  amount: number
  orderCurrency: string
  remarks: string
  orderDate: Date
  orderType2: string
  dayOfMonth: string
  calendarType: string
  dateFrom: Date
  dateTo: Date
  paymentNum: string
  orderPurpose: string
  orderFrequency: number
  amountOption: string
  name: string
  type: string
  accountTo: string

  sessionInfo: string
  beneficiaryPk: string
  beneficiaryId: string
  ernumber: string
  beneficiaryFamName: string
  companyPk: string
  sequence: string
  beneficiaryAccountFrom: string
  beneficiaryAccount: string
  beneficiaryLocalAccountNumber: string
  bankCode: string
  bankName: string
  bankAddress: string
  beneficiaryCA: string
  beneficiaryAmount: string
  beneficiaryCurrency: string
  zipCode: string
  poBox: string
  region: string
  city: string
  erAmount: string
  erCurrency: string
  phoneNumber: string
  email: string
  beneficiaryAccountFromCode: string
  beneficiaryAccountCode: string
  selected: string
  account15length: string
  transferReason: string
  refuseLvl: string
  countryCodeBE: string
  countryCode: string
  beneficiaryCategory: string
  invoiceNumber: string
  itemDescription: string
  nationality: string
  address1: string
  addressNumber: string
  presetBeneficiaryCategory: string
  internationalTransferLimit: string
  internationalBeneficiaryAccountsFrom: string
  placeBirth: string
  mobileNo: string
  currencyDTO: string
  payCode: string
  transferReasonLbl: string
  additionalInfoFlag: string
  additionalInfo1Lbl: string
  additionalInfo2Lbl: string

  constructor(
    _mandateNumber: number,
    _accountFrom: string,
    _beneficiaryFullName: string,
    _option: string,
    _lastPaymentStatus: string,
    _lastPaymentDate: string,
    _successfulPaymentNumber: string,
    _failedPaymentNumber: string,
    _totalAmountPaid: string,
    _nextPaymentDate: string,
    _amount: number,
    _orderCurrency: string,
    _remarks: string,
    _orderDate: Date,
    _orderType2: string,
    _dayOfMonth: string,
    _calendarType: string,
    _dateFrom: Date,
    _dateTo: Date,
    _paymentNum: string,
    _orderPurpose: string,
    _orderFrequency: number,
    _amountOption: string,
    _name: string,
    _type: string,
    _accountTo: string,
    sessionInfo: string,
    beneficiaryPk: string,
    beneficiaryId: string,
    ernumber: string,
    beneficiaryFamName: string,
    companyPk: string,
    sequence: string,
    beneficiaryAccountFrom: string,
    beneficiaryAccount: string,
    beneficiaryLocalAccountNumber: string,
    bankCode: string,
    bankName: string,
    bankAddress: string,
    beneficiaryCA: string,
    beneficiaryAmount: string,
    beneficiaryCurrency: string,
    zipCode: string,
    poBox: string,
    region: string,
    city: string,
    erAmount: string,
    erCurrency: string,
    phoneNumber: string,
    email: string,
    beneficiaryAccountFromCode: string,
    beneficiaryAccountCode: string,
    selected: string,
    account15length: string,
    transferReason: string,
    refuseLvl: string,
    countryCodeBE: string,
    countryCode: string,
    beneficiaryCategory: string,
    invoiceNumber: string,
    itemDescription: string,
    nationality: string,
    address1: string,
    addressNumber: string,
    presetBeneficiaryCategory: string,
    internationalTransferLimit: string,
    internationalBeneficiaryAccountsFrom: string,
    placeBirth: string,
    mobileNo: string,
    currencyDTO: string,
    payCode: string,
    transferReasonLbl: string,
    additionalInfoFlag: string,
    additionalInfo1Lbl: string,
    additionalInfo2Lbl: string,
  ) {
    this.mandateNumber = _mandateNumber
    this.accountFrom = _accountFrom
    this.beneficiaryFullName = _beneficiaryFullName
    this.option = _option
    this.lastPaymentStatus = _lastPaymentStatus
    this.lastPaymentDate = _lastPaymentDate
    this.successfulPaymentNumber = _successfulPaymentNumber
    this.failedPaymentNumber = _failedPaymentNumber
    this.totalAmountPaid = _totalAmountPaid
    this.nextPaymentDate = _nextPaymentDate
    this.amount = _amount
    ;(this.orderCurrency = _orderCurrency), (this.remarks = _remarks)
    this.orderDate = _orderDate
    this.orderType2 = _orderType2
    this.dayOfMonth = _dayOfMonth
    this.calendarType = _calendarType
    this.dateFrom = _dateFrom
    this.dateTo = _dateTo
    this.paymentNum = _paymentNum
    ;(this.orderPurpose = _orderPurpose),
      (this.orderFrequency = _orderFrequency),
      (this.amountOption = _amountOption),
      (this.name = _name),
      (this.type = _type),
      (this.accountTo = _accountTo),
      (this.sessionInfo = sessionInfo),
      (this.beneficiaryPk = beneficiaryPk),
      (this.beneficiaryId = beneficiaryId),
      (this.ernumber = ernumber),
      (this.beneficiaryFamName = beneficiaryFamName),
      (this.companyPk = companyPk),
      (this.sequence = sequence),
      (this.beneficiaryAccountFrom = beneficiaryAccountFrom),
      (this.beneficiaryAccount = beneficiaryAccount),
      (this.beneficiaryLocalAccountNumber = beneficiaryLocalAccountNumber),
      (this.bankCode = bankCode),
      (this.bankName = bankName),
      (this.bankAddress = bankAddress),
      (this.beneficiaryCA = beneficiaryCA),
      (this.beneficiaryAmount = beneficiaryAmount),
      (this.beneficiaryCurrency = beneficiaryCurrency),
      (this.zipCode = zipCode),
      (this.poBox = poBox),
      (this.region = region)
    ;(this.city = city),
      (this.erAmount = erAmount),
      (this.erCurrency = erCurrency),
      (this.phoneNumber = phoneNumber),
      (this.email = email),
      (this.beneficiaryAccountFromCode = beneficiaryAccountFromCode),
      (this.beneficiaryAccountCode = beneficiaryAccountCode),
      (this.selected = selected),
      (this.account15length = account15length),
      (this.transferReason = transferReason),
      (this.refuseLvl = refuseLvl),
      (this.countryCodeBE = countryCodeBE),
      (this.countryCode = countryCode),
      (this.beneficiaryCategory = beneficiaryCategory),
      (this.invoiceNumber = invoiceNumber),
      (this.itemDescription = itemDescription),
      (this.nationality = nationality),
      (this.address1 = address1),
      (this.addressNumber = addressNumber),
      (this.presetBeneficiaryCategory = presetBeneficiaryCategory),
      (this.internationalTransferLimit = internationalTransferLimit),
      (this.internationalBeneficiaryAccountsFrom =
        internationalBeneficiaryAccountsFrom),
      (this.placeBirth = placeBirth),
      (this.mobileNo = mobileNo),
      (this.currencyDTO = currencyDTO),
      (this.payCode = payCode),
      (this.transferReasonLbl = transferReasonLbl),
      (this.additionalInfoFlag = additionalInfoFlag),
      (this.additionalInfo1Lbl = additionalInfo1Lbl),
      (this.additionalInfo2Lbl = additionalInfo2Lbl)
  }
}

export class ModelServiceBeneficiariesList {
  beneficiaryName = ''
  beneficiaryType = ''
  bankCode = ''
  bankName = ''
  account = ''
  country = ''
  currency = ''
  idBeneficiary = ''
  email = ''
  beneficiaryAccountCode: string

  beneficiaryCategory: string
  countryCode: string
  branchName: string
  fullAccountNumber: string
  name: string
  dateBirth: any
  placeBirth: string
  mobileNo: string
  address1: string
  addressNumber: string
  zipCode: string
  poBox: string
  city: string
  nationality: string
  ernumber: string
  beneficiary: any
  nickName:string

  constructor(
    _beneficiaryName = '',
    _beneficiaryType = '',
    _bankCode = '',
    _bankName = '',
    _account = '',
    _country = '',
    _currency = '',
    _idBeneficiary = '',
    _email: string,
    _beneficiaryAccountCode: string,

    _beneficiaryCategory: string,
    _countryCode: string,
    _branchName: string,
    _fullAccountNumber: string,
    _name: string,
    _dateBirth: any,
    _placeBirth: string,
    _mobileNo: string,
    _address1: string,
    _addressNumber: string,
    _zipCode: string,
    _poBox: string,
    _city: string,
    _nationality: string,
    _ernumber: string,
    _beneficiary: any,
    nickName: string

  ) {
    this.beneficiaryName = _beneficiaryName
    this.beneficiaryType = _beneficiaryType
    this.bankCode = _bankCode
    this.bankName = _bankName
    this.account = _account
    this.country = _country
    this.currency = _currency
    this.idBeneficiary = _idBeneficiary
    this.email = _email
    this.beneficiaryAccountCode = _beneficiaryAccountCode

    this.beneficiaryCategory = _beneficiaryCategory
    this.countryCode = _countryCode
    this.branchName = _branchName
    this.fullAccountNumber = _fullAccountNumber
    this.name = _name
    this.dateBirth = _dateBirth
    this.placeBirth = _placeBirth
    this.mobileNo = _mobileNo
    this.address1 = _address1
    this.addressNumber = _addressNumber
    this.zipCode = _zipCode
    this.poBox = _poBox
    this.city = _city
    this.nationality = _nationality
    this.ernumber = _ernumber
    this.beneficiary = _beneficiary
    this.nickName = nickName
  }
}

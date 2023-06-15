import { Account } from 'app/Application/Model/account'
import { Currency } from './currency'

export class Beneficiary {
  account15length: string
  additionalInfo1Lbl: string
  additionalInfo2Lbl: string
  additionalInfoFlag: string
  address1: string
  addressNumber: string
  bankAddress: string
  bankCode: string
  bankName: string
  beneficiaryAccount: Account
  beneficiaryAccountCode: string
  beneficiaryAccountFrom: Account
  beneficiaryAccountFromCode: string
  beneficiaryAmount: number
  beneficiaryCA: number
  beneficiaryCategory: string
  beneficiaryCurrency: string
  beneficiaryFamName: string
  beneficiaryFullName: string
  beneficiaryId: string
  beneficiaryLocalAccountNumber: string
  beneficiaryPk: number
  city: string
  companyPk: number
  countryCode: string
  countryCodeBE: string
  currencyDTO: Currency
  dateBirth: string
  email: string
  erAmount: number
  erCurrency: string
  ernumber: string
  internationalBeneficiaryAccountsFrom: Account[]
  internationalTransferLimit: number
  invoiceNumber: string
  itemDescription: string
  mobileNo: string
  name: string
  nationality: string
  payCode: string
  phoneExtension: string
  phoneInternationalCode: string
  phoneNumber: string
  placeBirth: string
  poBox: string
  presetBeneficiaryCategory: string
  refuseLvl: string
  region: string
  remarks: string
  selected: string
  sequence: string
  transferReason: string
  transferReasonLbl: string
  transferSavedRejected: string
  type: string
  zipCode: string
  nickName:string
}

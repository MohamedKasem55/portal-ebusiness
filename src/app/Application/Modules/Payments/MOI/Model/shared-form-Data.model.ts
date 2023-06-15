import { Account } from './../../../../Model/account'

export class FormData {
  vehicleRegisName = ''
  vehicleBodyTypeName = ''
  jobName = ''
  issuanceName = ''
  dateShort = ''
  passportName = ''
  licenseName = ''
  durationName = ''

  prueba = ''
  prueba2 = ''
  accounts: any[] = []
  visaTypes: any[] = []
  chequeBookType: string[] = []
  account: Account = new Account()
  chequeType = ''

  serviceType = ''
  serviceSubType = ''
  serviceTypeId = ''
  serviceSubTypeID = ''

  // Family VISA
  numberVisas = ''

  //Labor VISA
  visaType = ''
  visaTypeTransform = ''
  amount = ''
  beneName = ''
  feeAmount = ''

  // EXPATRIATE SERVICES
  iquamaDurations: any[] = []
  iquamaDuration: string
  jobCategorys: any[] = []
  jobCategory = ''
  visaDurations: any[] = []
  visaDuration = ''

  borderNumber = ''
  sponsorId = ''
  iquamaId = ''
  visaNumber = ''
  headHouseholdIdNumber = ''
  numberDependant = ''
  associatedBorderNumber = ''

  // VEHICLE REGISTRATION SERVICES
  vehicleRegistrationTypes: any[] = []
  vehicleBodyTypes: any[] = []
  vehicleBodyType = ''
  currentOwnerId = ''
  vehicleSequenceNumber = ''
  newOwnerId = ''
  newVehicleRegistrationType = ''
  vehicleCustomCardNumber = ''

  // TRAFFIC VIOLATIONS
  violatorId = ''
  violationID = ''

  // CIVIL DEFENSE
  verdictNumber = ''

  // SAUDI PASSPORT SERVICES
  passportTypes: any[] = []
  passportType = ''
  durations: any[] = []
  duration = ''
  citizenID = ''

  // DRINVING LICENSE SERVICES
  licenseTypes: any[] = []
  licenseType = ''
  durationLicenses: any[] = []
  durationLicense = ''
  beneficiaryID = ''

  // CIVIL SERVICES
  issuanceReasons: any[] = []
  issuanceReason = ''
  nationnalIdNumber = ''
  birthDate: Date
  deathDate: Date
  marriageDate: Date
  divorceDate: Date
  cardVersionNo = ''

  generateChallengeAndOTP
  resultSadadItems
  transactionType
  resultAdditionalData
  fees
  batchList

  deleteData() {
    this.vehicleRegisName = ''
    this.vehicleBodyTypeName = ''
    this.jobName = ''
    this.issuanceName = ''
    this.dateShort = ''
    this.passportName = ''
    this.licenseName = ''
    this.durationName = ''

    this.prueba = ''
    this.prueba2 = ''
    this.accounts = new Array()
    this.chequeBookType = []
    this.account = new Account()
    this.chequeType = ''

    this.serviceType = ''
    this.serviceSubType = ''
    this.serviceTypeId = ''
    this.serviceSubTypeID = ''

    // Family VISA
    this.numberVisas = ''
    this.visaType = ''

    //Labor VISA
    this.visaType = ''
    this.visaTypeTransform = ''
    this.amount = ''
    this.beneName = ''
    this.feeAmount = ''

    // EXPATRIATE SERVICES
    this.borderNumber = ''
    this.iquamaDurations = []
    this.jobCategorys = []
    this.visaDurations = []
    this.iquamaDuration = ''
    this.jobCategory = ''
    this.visaDuration = ''
    this.sponsorId = ''
    this.iquamaId = ''
    this.visaNumber = ''
    this.headHouseholdIdNumber = ''
    this.numberDependant = ''
    this.associatedBorderNumber = ''

    // VEHICLE REGISTRATION SERVICES
    this.vehicleRegistrationTypes = []
    this.vehicleBodyTypes = []
    this.vehicleBodyType = ''
    this.currentOwnerId = ''
    this.vehicleSequenceNumber = ''
    this.newOwnerId = ''
    this.newVehicleRegistrationType = ''

    this.vehicleCustomCardNumber = ''

    // TRAFFIC VIOLATIONS
    this.violatorId = ''
    this.violationID = ''

    // CIVIL DEFENSE
    this.verdictNumber = ''

    // SAUDI PASSPORT SERVICES
    this.passportTypes = []
    this.passportType = ''
    this.durations = []
    this.duration = ''
    this.citizenID = ''

    // DRINVING LICENSE SERVICES
    this.licenseTypes = []
    this.licenseType = ''
    this.durationLicenses = []
    this.durationLicense = ''
    this.beneficiaryID = ''

    // CIVIL SERVICES
    this.issuanceReasons = []
    this.issuanceReason = ''
    this.nationnalIdNumber = ''
    this.birthDate = new Date()
    this.deathDate = new Date()
    this.marriageDate = new Date()
    this.divorceDate = new Date()
    this.cardVersionNo = ''

    this.generateChallengeAndOTP = {}
    this.resultSadadItems = []
    this.transactionType = ''
    this.resultAdditionalData = ''
    this.fees = ''
    this.batchList = []
  }
}

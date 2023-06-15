import { dossierType } from '../enum/enum'

export interface Doc {
  documentCode: string

  description: string

  fileName: string

  fileType: string

  fileContent: string | ArrayBuffer
}

export interface VehiclesLstItem {
  dealerName?: string

  brandName?: string

  modelName?: string

  vehicleSegment?: string

  vehicleVariant?: string
  price?: number
  modelYear?: string
}

export interface PurposeUse {
  txt: string

  id: string
}

export interface DossairData {
  dossierType: dossierType.CRL

  financeProductCode: string

  accountNumber?: string

  establishmentDate?: string

  businessActivities?: string

  businessOutletsNum?: string

  businessOutletsType?: string

  businessLocation?: string

  businessType?: string
}

export interface BusinessDetails {
  establishmentDate?: string

  businessActivities?: string

  businessOutletsNum?: string

  businessOutletsType?: string

  businessLocation?: string

  businessType?: string
}

export interface ProductDetails {
  accountNumber: string
  dossierID: string
  fianceAccount: string
  MDPay: string
  FinstDate: string
  EinstDate: string
  financeTenure: string
  FinstAmount: string
  finalInstAmount: string
  adminFee: string
}
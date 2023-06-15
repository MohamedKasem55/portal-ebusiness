import { GenericResponse } from 'app/Application/Model/app.response'
import {RequestValidate} from "../../../Model/requestvalidateType";
import exp from "constants";

export interface PrepaidCardsRequestValidate {
  prepaidCardsRequestNewDSO: PrepaidCardsRequestNewDSO
}

export interface  PrepaidCardsRequestNewDSO {
  accountNumber: string
  countryCode: string
  nationalId: string
  mobileNumber: string
  nationality: string
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  city: string
  companyEmbossingName: string
  ownerEmbossingName: number
  requesterType: string
}

export interface PrepaidCardAttachment {
  dossierId: string
  fileName: string
  fileType: string
  fileCode: DocCode
  fileContent: string | ArrayBuffer
}

export interface PrepaidCardRequestConfirm {
  prepaidCardsRequestNewDSO: PrepaidCardsRequestNewDSO
  requestValidate: RequestValidate
}

export interface RequestPrepaidCardValidateResponse extends GenericResponse {
  prepaidCardsRequestNewDSO: PrepaidCardsRequestNewDSO;
  generateChallengeAndOTP: any
}

export enum DocCode {
  ID,
  EMP_CERT,
  COMMREG
}

export enum UserJourney {
  EMPLOYEE,
  OWNER,
}




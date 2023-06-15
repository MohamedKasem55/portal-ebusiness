import { ResponseGenerateChallenge } from './responsegeneratechallenge.type'
import { ErrorResponse } from './welcome'

export class AppResponse {
  errorCode: string
  errorDescription: string
  errorResponse: any

  constructor(
    errorCode: string,
    errorDescription: string,
    errorResponse?: any,
  ) {
    this.errorCode = errorCode
    this.errorDescription = errorDescription
  }
}

export interface GenericResponse {
  errorCode?: string
  errorDescription?: string
  errorResponse?: ErrorResponse
  generateChallengeAndOTP?: ResponseGenerateChallenge
}

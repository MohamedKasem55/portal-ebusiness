import { ResponseGenerateChallenge } from './responsegeneratechallenge.type'
import { ErrorResponse } from './welcome'

export class ErrorGenerate {
  errorCode: string
  errorDescription: string
  generateChallengeAndOTP: ResponseGenerateChallenge
  errorResponse: ErrorResponse

  constructor(
    _errorCode: string,
    _errorDescription: string,
    _errorResponse: ErrorResponse,
    _generateChallengeAndOTP?: ResponseGenerateChallenge,
  ) {
    this.errorCode = _errorCode
    this.errorDescription = _errorDescription
    this.errorResponse = _errorResponse
    this.generateChallengeAndOTP = _generateChallengeAndOTP
  }
}

import { ResponseGenerateChallenge } from './responsegeneratechallenge.type'

export class Exception {
  errorCode: string
  errorDescription: string
  responseGenerateChallenge: ResponseGenerateChallenge

  constructor(
    _errorCode: string,
    _errorDescription: string,
    _responseGenerateChallenge?: ResponseGenerateChallenge,
  ) {
    this.errorCode = _errorCode
    this.errorDescription = _errorDescription
    this.responseGenerateChallenge = _responseGenerateChallenge
  }
}

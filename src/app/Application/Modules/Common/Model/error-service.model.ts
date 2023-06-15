export class ErrorServiceModel {
  errorCode: string
  errorDescription: string

  constructor(_errorCode: string, _errorDescription: string) {
    this.errorCode = _errorCode
    this.errorDescription = _errorDescription
  }
}

export class RequestValidate {
  otp: string
  password: string
  response: string
  challengeNumber: string

  valid(): boolean {
    if (this.otp) {
      return /[0-9]{4,6}/.test(this.otp)
    }
    if (this.password) {
      return /.{4,14}/.test(this.password)
    }
    if (this.response) {
      return /[0-9]{4,6}/.test(this.response)
    }
  }

  clear() {
    this.otp = null
    this.password = null
    this.response = null
    this.challengeNumber = null
  }
}

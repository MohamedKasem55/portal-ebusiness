import { RequestValidate } from 'app/Application/Model/requestvalidateType'

export class AliasManagement {
  iban: string
  proxyAction: string
  proxyType: string
  proxyValue: string
  reason: string
  registrationId: string
  requestValidate: RequestValidate

  constructor(
    iban: string,
    proxyAction: string,
    proxyType: string,
    proxyValue: string,
    reason: string,
    registrationId: string,
    requestValidate: RequestValidate,
  ) {
    this.iban = iban
    this.proxyAction = proxyAction
    this.proxyType = proxyType
    this.proxyValue = proxyValue
    this.reason = reason
    this.registrationId = registrationId
    this.requestValidate = requestValidate
  }
}

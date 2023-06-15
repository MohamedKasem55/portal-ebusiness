export interface ValidUser {
  companyId: string
  userId: string
  password: string
  token?: string
  otp?: string
  challenge?: string
}

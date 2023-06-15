import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

export class FormData {
  batch: any = {}
  accounts: any[] = []
  chequeBookType: string[] = []
  account = ''
  chequeType: string
  generateChallengeAndOTP = new ResponseGenerateChallenge()

  deleteData() {
    this.batch = {}
    this.accounts = [{}]
    this.chequeBookType = []
    this.account = ''
    this.chequeType = ''
    this.generateChallengeAndOTP = new ResponseGenerateChallenge()
  }
}

/**
 * A model for an individual corporate employee
 */
export class CorporateEmployee {
  timeStamp: string
  userName: string
  userId: string

  constructor(timeStamp: string, userName: string, userId: string) {
    this.timeStamp = timeStamp
    this.userName = userName
    this.userId = userId
  }
}

export class StatusLevels {
  status: string
  nextStatus: string
  constructor(status: string, nextStatus: string) {
    this.status = status
    this.nextStatus = nextStatus
  }
}

export class ModelFeedbackTransfer {
  fileReference: string
  fileType: string
  fileStatus: string
  requestDate: Date
  transfaerDate: Date

  constructor(
    _fileReference: string,
    _fileType: string,
    _fileStatus: string,
    _requestDate: Date,
    _transfaerDate: Date,
  ) {
    this.fileReference = _fileReference
    this.fileType = _fileType
    this.fileStatus = _fileStatus
    this.requestDate = _requestDate
    this.transfaerDate = _transfaerDate
  }
}

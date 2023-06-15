export class ModelFeedBackFiles {
  userId: string
  fileName: string
  transfaerDate: string
  requestDate: string
  fileStatus: string
  fileType: string
  fileReference: string

  constructor(
    _userId = '',
    _fileName = '',
    _transfaerDate = '',
    _fileStatus = '',
    _fileType = '',
    _fileReference = '',
    _requestDate = '',
  ) {
    this.userId = _userId
    this.fileName = _fileName
    this.transfaerDate = _transfaerDate
    this.fileStatus = _fileStatus
    this.fileType = _fileType
    this.fileReference = _fileReference
    this.requestDate = _requestDate
  }
}

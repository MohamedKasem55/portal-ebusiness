export class ModelServiceMoiFeedBackFilesList {
  fileName: string
  transfaerDate: Date
  fileStatus: string
  fileType: string

  constructor(
    _fileName = '',
    _transfaerDate = '',
    _fileStatus = '',
    _fileType = '',
  ) {
    this.fileName = _fileName
    this.transfaerDate = new Date()
    this.fileStatus = _fileStatus
    this.fileType = _fileType
  }
}

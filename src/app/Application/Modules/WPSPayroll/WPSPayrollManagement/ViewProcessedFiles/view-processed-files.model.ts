export class ModelViewProcessedFiles {
  fileName = ''
  batchName = ''
  accountFrom = ''
  dateValue = ''
  totalAmount = ''
  total = ''
  rajhiRecordAmount = ''
  rajhiRecordCount = ''
  localRecordAmount = ''
  localRecordCount = ''
  initiatedBy = ''
  initiationDate = ''
  approvedBy = ''
  approvedDate = ''

  constructor(
    _fileName = '',
    _batchName = '',
    _accountFrom = '',
    _dateValue = '',
    _totalAmount = '',
    _total = '',
    _rajhiRecordAmount = '',
    _rajhiRecordCount = '',
    _localRecordAmount = '',
    _localRecordCount = '',
    _initiatedBy = '',
    _initiationDate = '',
    _approvedBy = '',
    _approvedDate = '',
  ) {
    this.fileName = _fileName
    this.batchName = _batchName
    this.accountFrom = _accountFrom
    this.dateValue = _dateValue
    this.totalAmount = _totalAmount
    this.total = _total
    this.rajhiRecordAmount = _rajhiRecordAmount
    this.rajhiRecordCount = _rajhiRecordCount
    this.localRecordAmount = _localRecordAmount
    this.localRecordCount = _localRecordCount
    this.initiatedBy = _initiatedBy
    this.initiationDate = _initiationDate
    this.approvedBy = _approvedBy
    this.approvedDate = _approvedDate
  }
}

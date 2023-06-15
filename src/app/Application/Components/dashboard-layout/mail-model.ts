export class Mail {
  mailPk: string
  subject: string
  content: string
  from: string
  fromName: string
  date: Date
  status: string
  to: string
  toName: string

  constructor(builder: MailBuilder) {
    this.mailPk = builder.mailId
    this.subject = builder.subject
    this.content = builder.content
    this.from = builder.from
    this.fromName = builder.fromName
    this.date = builder.date
    this.status = builder.status
    this.to = builder.to
    this.toName = builder.toName
  }
}

export class MailBuilder {
  private _mailPk: string
  private _subject: string
  private _content: string
  private _from: string
  private _fromName: string
  private _date: Date
  private _status: string
  private _to: string
  private _toName: string

  constructor() {}

  get mailId() {
    return this._mailPk
  }
  withMailId(mailPk: string): MailBuilder {
    this._mailPk = mailPk
    return this
  }
  get subject() {
    return this._subject
  }
  withSubject(subject: string): MailBuilder {
    this._subject = subject
    return this
  }
  get content() {
    return this._content
  }
  withContent(content: string): MailBuilder {
    this._content = content
    return this
  }
  get from() {
    return this._from
  }
  withFrom(from: string): MailBuilder {
    this._from = from
    return this
  }
  get fromName() {
    return this._fromName
  }
  withFromName(fromName: string): MailBuilder {
    this._fromName = fromName
    return this
  }
  get date() {
    return this._date
  }
  withDate(date: string): MailBuilder {
    this._date = new Date(date)
    return this
  }

  get status() {
    return this._status
  }

  withStatus(status: string): MailBuilder {
    this._status = status
    return this
  }

  get to() {
    return this._to
  }
  withTo(to: string): MailBuilder {
    this._to = to
    return this
  }
  get toName() {
    return this._toName
  }
  withToName(toName: string): MailBuilder {
    this._toName = toName
    return this
  }
  build(): Mail {
    return new Mail(this)
  }
}

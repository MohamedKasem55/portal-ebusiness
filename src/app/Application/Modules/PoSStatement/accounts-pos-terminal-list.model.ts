export class AccountsPosTerminalList {
  static newOfJson(json: any): AccountsPosTerminalList {
    return new AccountsPosTerminalList(
      json._terminalName,
      json._terminalID,
      json._account,
      json.location,
      json._region,
      json._city,
      json._mobile,
    )
  }

  static nuevaColeccionDesdeJson(json: any[]): AccountsPosTerminalList[] {
    return json.map(
      (AccountsPosTerminalListJson: any): AccountsPosTerminalList => {
        return AccountsPosTerminalList.newOfJson(AccountsPosTerminalList)
      },
    )
  }
  constructor(
    public terminalName: string,
    public terminalID: string,
    public account: string,
    public location: string,
    public region: string,
    public city: string,
    public mobile: string,
  ) {}
}

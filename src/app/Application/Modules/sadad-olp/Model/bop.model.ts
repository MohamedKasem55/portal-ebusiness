export interface ISessionInfo {
  language?: 'string'
  profileNumber?: 'string'
  sessionId?: 'string'
  uid?: 'string'
  userId?: 'string'
  userPk?: number
  workstationId?: 'string'
}

export interface IBop {
  id?: string
  details?: string
  map?: number
  offset?: number
  order?: string
  orderType?: string
  sessionInfo?: ISessionInfo
  url?: string
  version?: string
}

export class Bop implements IBop {
  constructor(
    public id?: string,
    public details?: string,
    public map?: number,
    public offset?: number,
    public order?: string,
    public orderType?: string,
    public sessionInfo?: ISessionInfo,
    public url?: string,
    public version?: string,
  ) {}
}

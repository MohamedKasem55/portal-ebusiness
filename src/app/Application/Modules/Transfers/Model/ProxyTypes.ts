
export class ProxyTypes {
  private staticProxyTypes = [
    {
      key: 'mobile',
      value: 'transfer.ips.proxyType.mobile',
      type: 'MOIBLE_NUMBER',
      pattern: '(05)[0-9]{8,8}$',
      max: 18,
      min: 9,
    },
    {
      key: 'email',
      value: 'transfer.ips.proxyType.Email',
      type: 'EMAIL',
      pattern: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
      max: 100,
      min: 0,
    },
    {
      key: 'ID',
      value: 'transfer.ips.proxyType.ID',
      type: 'CR_OR_UNNID',
      pattern: '^[0-9]*$',
      max: 10,
      min: 9,
    },
    {
      key: 'IBAN',
      value: 'transfer.ips.proxyType.IBAN',
      type: 'IBAN',
      pattern: '',
      max: 24,
      min: 22,
    },
    {
      key: 'CR_OR_UNN',
      value: 'transfer.ips.proxyType.CR_OR_UNN',
      type: 'CR_OR_UNNID',
      pattern: '^[0-9]*$',
      max: 10,
      min: 10,
    },
    {
      key: 'ID_IQAMA',
      value: 'transfer.ips.proxyType.ID_IQAMA',
      type: 'ID_IQAMA',
      pattern: '',
      max: 10,
      min: 10,
    },
  ]

  public proxyTypes: any[]

  constructor(types: string[]) {
    if(types && types.length > 0){
      const find = proxyTypeKey => types.find( typeKey => typeKey === proxyTypeKey);
      this.proxyTypes = this.staticProxyTypes.filter(proxyType => find(proxyType.key));
    } else {
      this.proxyTypes = this.staticProxyTypes
    }
  }
}

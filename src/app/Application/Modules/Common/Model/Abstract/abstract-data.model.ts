export abstract class AbstractDataModel {
  protected constructor(jsonData) {
    this.setFullData(jsonData)
  }

  abstract setFullData(data): AbstractDataModel
}

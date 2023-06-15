export abstract class AbstractDataDetailsModel {
  protected constructor(jsonData) {
    this.setFullData(jsonData)
  }

  abstract setFullData(data): AbstractDataDetailsModel
}

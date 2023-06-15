export abstract class AbstractDataAddInitialModel {
  protected constructor(jsonData) {
    this.setFullData(jsonData)
  }

  abstract setFullData(data): AbstractDataAddInitialModel
}

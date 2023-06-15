export interface ImageBannerModel {
  imagePk: number
  type: string
  content: string
}

export interface BannerModel {
  bannerPk: number
  description: string
  hyperlink: string
  englishPath: string
  arabicPath: string
  dateFrom: string
  dateTo: string
  timeFrom: string
  timeTeo: string
  createionDate: string
  hits: number
  defatultBanner: string
  frequency: string
  name: string
  display: string
  image: ImageBannerModel
  bannerCampaigns: string
  menuBanner: boolean
  externalBanner: boolean
  internalBanner: boolean
}

export interface BannerErrorsMessage {
  englishMessage: string
  arabicMessage: string
}

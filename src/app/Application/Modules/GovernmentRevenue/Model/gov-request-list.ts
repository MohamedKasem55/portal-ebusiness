import { ErrorServiceResponse } from "app/Application/Model/errorServiceResponse"
import { ResponseGenerateChallenge } from "app/Application/Model/responsegeneratechallenge.type"
import { GovRevenueBatchDSO } from "./gov-revenue-batch"

export class ResponseGovRevenueRequestList {
    batchList: GovRevenueBatchDSO[]
    errorCode: string
    errorDescription: string
    errorResponse: ErrorServiceResponse
    generateChallengeAndOTP: ResponseGenerateChallenge
}
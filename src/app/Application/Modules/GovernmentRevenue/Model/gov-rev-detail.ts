import { ErrorServiceResponse } from "app/Application/Model/errorServiceResponse"
import { ResponseGenerateChallenge } from "app/Application/Model/responsegeneratechallenge.type"
import { GovRevenueFileSummaryDSO } from "./gov-rev-file-sumary"
import { GovRevenueBatchDSO } from "./gov-revenue-batch"

export class ResponseGovRevenueFileDetails {
    batch: GovRevenueBatchDSO
    errorCode: string
    errorDescription: string
    errorResponse: ErrorServiceResponse
    generateChallengeAndOTP: ResponseGenerateChallenge
    summary: GovRevenueFileSummaryDSO
}
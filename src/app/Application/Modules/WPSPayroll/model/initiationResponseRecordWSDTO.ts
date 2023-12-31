/**
 * Api Documentation
 * Api Documentation
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { LevelStatusPair } from './levelStatusPair'

export interface InitiationResponseRecordWSDTO {
  batchId?: number
  levelStatusList?: Array<LevelStatusPair>
  reason?: string
  returnCode?: string
  status?: InitiationResponseRecordWSDTO.StatusEnum
}
export namespace InitiationResponseRecordWSDTO {
  export type StatusEnum = 'NOT_ALLOWED' | 'PROCESS' | 'PENDING'
  export const StatusEnum = {
    NOTALLOWED: 'NOT_ALLOWED' as StatusEnum,
    PROCESS: 'PROCESS' as StatusEnum,
    PENDING: 'PENDING' as StatusEnum,
  }
}

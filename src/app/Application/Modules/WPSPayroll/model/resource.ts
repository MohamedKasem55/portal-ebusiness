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
import { InputStream } from './inputStream'
import { URI } from './uRI'
import { URL } from './uRL'

export interface Resource {
  description?: string
  file?: any
  filename?: string
  inputStream?: InputStream
  open?: boolean
  readable?: boolean
  uri?: URI
  url?: URL
}
import { LogLevel } from 'log4ts/build/LogLevel'

export class AppConf {
  public static get LOG_LEVEL(): LogLevel {
    return LogLevel.ERROR
  }
}

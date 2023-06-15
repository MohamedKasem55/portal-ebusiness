import { Injectable } from '@angular/core'
import ConsoleAppender from 'log4ts/build/appenders/ConsoleAppender'
import { IAppender } from 'log4ts/build/IAppender'
import { ILayout } from 'log4ts/build/ILayout'
import Logger from 'log4ts/build/Logger'
import LoggerConfig from 'log4ts/build/LoggerConfig'
import CustomBasicLayout from './custom.layout'
import { AppConf } from './log.app.conf'

// WILL MANAGE LOGGING INTO WEB CONSOLE (BROWSER)
@Injectable()
export class LogService {
  public log: Logger

  private appender: IAppender
  private layout: ILayout
  private config: LoggerConfig

  constructor() {
    this.layout = new CustomBasicLayout()
    //  this.layout = new BasicLayout();
    this.appender = new ConsoleAppender()
    this.appender.setLayout(this.layout)
    this.config = new LoggerConfig(this.appender)
    this.config.setLevel(AppConf.LOG_LEVEL)
    this.log = new Logger()
    Logger.setConfig(this.config)
  }

  getlog() {
    return //console.log.bind(console);
  }

  /* init(){
    this.layout = new BasicLayout();
    this.appender = new ConsoleAppender();
    this.appender.setLayout(this.layout);
    this.config = new LoggerConfig(this.appender);
    this.config.setLevel(AppConf.LOG_LEVEL);
    this.log = new Logger();
    Logger.setConfig(this.config);
  }*/
}

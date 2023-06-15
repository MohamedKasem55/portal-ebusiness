import { ILayout } from 'log4ts/build/ILayout'
import { LogEntry } from 'log4ts/build/LogEntry'
import { logLevelToString } from 'log4ts/build/LogLevel'
/**
 * Simple layout, that formats logs as
 * "{time} {level} [{tag}] - {message}"
 */
export default class CustomBasicLayout implements ILayout {
  format(entry: LogEntry): string {
    return (
      this.formatDate(entry.time) +
      ' ' +
      logLevelToString(entry.level) +
      ' - ' +
      entry.message
    )
  }

  private formatDate(date: Date): string {
    function pad(number) {
      if (number < 10) {
        return '0' + number
      }
      return number
    }

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      ' ' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
    )
  }
}

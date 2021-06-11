/* This is a logger; it needs to write to console. */
/* eslint-disable no-console */
const colors = require('colors/safe');
const { promises } = require('fs');

const fs = promises;

/**
 * @class Log
 * @classdesc Utility class that will write log messages to a file, console, or both
 */
class Log {
  /**
   * @param  {string} logFile path and filename to the log file
   */
  constructor(logFile) {
    this.logFile = logFile;
  }

  /**
     * @description Logs an error to a log file
     * @param  {Error} error
     *
     * @returns {Promise<Log>} Returns the instance so that other methods can be chained
     */
  async errorToFileAsync(error) {
    const rawMessage = error
      ? error.stack
      : this.rawMessage;

    this.rawMessage = rawMessage;
    try {
      await fs.appendFile(this.logFile, Log.styleInfo(this.rawMessage, true));
    } catch (errorLoggingError) {
      console.log('That sucks. Couldn\'t write the error');
      console.error(errorLoggingError);
    }

    return this;
  }


  /** Logs information to a logfile
   * @param  {string} info
   *
   * @returns {Promise<Log>} returns instance so that method can be chained
   */
  async infoToFileAsync(info) {
    const rawMessage = info || this.rawMessage;

    this.rawMessage = rawMessage;
    try {
      await fs.appendFile(this.logFile, Log.styleInfo(rawMessage, true));
    } catch (errorLoggingError) {
      console.log('That sucks. Couldn\'t write the error');
      console.error(errorLoggingError);
    }

    return this;
  }

  /**
   * Wraps a log message in a block and optionally puts a timestamp on it
   * @static
   * @param  {string} info
   * @param  {boolean} showTimestamp=false
   *
   * @returns {string} message wrapped in block with optional timestamp
   */
  static styleInfo(info, showTimestamp = false) {
    return `
==============${showTimestamp ? new Date() : ''}===============
${info}
=============================
`;
  }


  /**
   * Logs a message to the console, optionally changing the style and making it white if it's important
   * @param  {string} info
   * @param  {boolean} isImportant
   *
   * @returns {Log} returns instance so that method can be chained
   */
  toConsole(info, isImportant) {
    const rawMessage = info || this.rawMessage;
    const infoMessage = Log.styleInfo(rawMessage);

    this.rawMessage = rawMessage;
    if (isImportant) {
      console.log(colors.bold.white(infoMessage));
    } else {
      console.log(colors.blue(infoMessage));
    }

    return this;
  }


  /**
   * sets a timerStart property on the Log instance
   *
   * @returns {Log} returns instance for chaining
   */
  startTimer() {
    this.timerStart = Date.now();
    if (this.timerEnd) {
      delete this.timerEnd;
    }
    return this;
  }


  /**
   * Stops a timer running on the instance
   *
   * @returns {Log} returns instance so that method can be chained
   */
  endTimer() {
    this.timerEnd = Date.now();

    return this;
  }

  /**
   * Time, in seconds, from when a timer was started, and when it ended
   * @type {string}
   * @readonly
   *
   */
  get elapsedTime() {
    let elapsedTime = null;

    if (this.timerStart && this.timerEnd) {
      elapsedTime = this.timerEnd - this.timerStart;
    }
    return (elapsedTime / 1000);
  }
}

module.exports = Log;

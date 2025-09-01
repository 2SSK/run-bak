class Logger {
  constructor(config) {
    this.config = config || { level: "info" };
  }

  info(message, context = {}) {
    this._log("info", message, context);
  }

  error(message, context = {}) {
    this._log("error", message, context);
  }

  warn(message, context = {}) {
    this._log("warn", message, context);
  }

  debug(message, context = {}) {
    this._log("debug", message, context);
  }

  _log(level, message, context) {
    if (this._shouldLog(level)) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...context,
      };
      console.log(JSON.stringify(logEntry));
    }
  }

  _shouldLog(level) {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return levels[level] <= levels[this.config.level];
  }
}

export default Logger;

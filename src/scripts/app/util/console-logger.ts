/**
 * Utility class for console logging.
 */
class ConsoleLogger {
  static trace(): void {
    const stack = ConsoleLogger.getStackTrace_();
    if (stack.length > 1) {
      console.log(stack[1]);
    }
  }

  static info(msg: string | object): void {
    console.log(ConsoleLogger.getMsg_(msg));
  }

  static error(msg?: string | object): void {
    const stack = ConsoleLogger.getStackTrace_();
    for (let i = stack.length - 1; i > 0; --i) {
      console.error(stack[i]);
    }

    if (msg) {
      console.error(ConsoleLogger.getMsg_(msg));
    }
  }

  private static getStackTrace_(): string[] {
    const stack = Error().stack?.match(/.*at(.*)/g);
    if (stack) {
      const res = [];
      for (let i = 1; i < stack.length; ++i) {
        res.push(stack[i].substring(7));  // remove "    at " at start
      }
      return res;
    } else {
      return [];
    }
  }

  private static getMsg_(msg: string | object): string {
    if (typeof msg === 'string') {
      return msg;
    } else {
      return JSON.stringify(msg);
    }
  }
}

export default ConsoleLogger;

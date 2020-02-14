namespace ConsoleLogger {
  function getStackTrace_() : string[] {
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

  function getMsg_(msg: string | object): string {
    if (typeof msg === 'string') {
      return msg;
    } else {
      return JSON.stringify(msg);
    }
  }

  export function trace(): void {
    const stack = getStackTrace_();
    if (stack.length > 1) {
      console.log(stack[1]);
    }
  }

  export function info(msg: string | object): void {
    console.log(getMsg_(msg));
  }

  export function error(msg?: string | object): void {
    const stack = getStackTrace_();
    for (let i = stack.length - 1; i > 0; --i) {
      console.error(stack[i]);
    }

    if (msg) {
      console.error(getMsg_(msg));
    }
  }
}

export default ConsoleLogger;

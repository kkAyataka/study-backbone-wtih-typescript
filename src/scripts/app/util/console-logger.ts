/**
 * Gets formatted stack trace string array.
 * @param err
 */
function getStackTrace(err: Error): string[] {
  const stack = err.stack ?? '';
  if (stack) {
    const regex = new RegExp(`  (.*at.*)\\(${location.origin}/(.*):(.*):(.*)\\)`, 'g');
    const res = [];
    let i;
    while ((i = regex.exec(stack)) !== null) {
      if (i.length >= 5) {
        res.push(`msg:${i[1]}\tsrc:${i[2]}\tr:${i[3]}\tc:${i[4]}`);
      }
    }

    return res;
  } else {
    return [];
  }
}

/**
 * Gets message string.
 * If the parameter is object, this function return JSON.stringify result.
 * @param msg
 */
function getMsg(msg: string | object): string {
  if (typeof msg === 'string') {
    return msg;
  } else {
    return JSON.stringify(msg);
  }
}

/**
 * Outputs automatic generating message by stack trace.
 * This message can be used for function call tracing.
 *
 * ```
 * 'click #trace-btn': (): void => {
 *   cl.infoTrace(); // msg:  at SubView.click #trace-btn 	src:scripts/app/inheritance/main-view/sub-view.js	r:44	c:24
 * },
 * ```
 */
export function infoTrace(): void {
  const stack = getStackTrace(Error());
  if (stack.length > 1) {
    console.log(stack[1]);
  }
}

/**
 * Show stack trace and error message
 * @param msg
 * @param err Error object
 *   If this parameter is specified, get stack trace from this object,
 *   If this parameter is not specified, get stak trace from new Error object.
 */
export function fatal(msg?: string | object, err?: Error): void {
  const endIndex = (err) ? 0 : 1;
  const stack = getStackTrace(err ?? Error());
  for (let i = stack.length - 1; i >= endIndex; --i) {
    console.error(stack[i]);
  }

  if (msg) {
    console.error(getMsg(msg));
  }
}

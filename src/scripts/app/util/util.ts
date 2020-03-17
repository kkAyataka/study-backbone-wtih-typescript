/**
 * Sleep by setTimeout
 * @param sleepMs sleep time
 * @return Always resolved with no data.
 */
export async function sleep(sleepMs: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), sleepMs);
  });
}

/**
 * Ignore rejected promise.
 * @param promise Target promise for ignoring
 *   If this promise is rejected,
 *   This function ignore error and return resolved promise with error object.
 * @param errors
 *   If the promise parameter is rejected,
 *   rejected object (e.g. error object) is stored this parameter.
 *   Promise is forced resolbed but you can check by errors.
 */
export async function ignoreError<T>(promise: Promise<T>, errors?: any[]): Promise<T | void> {
  try {
    return await promise;
  } catch(err) {
    if (errors) {
      errors.push(err);
    }
    return Promise.resolve(err);
  }
}

/**
 * I dont't now this function is necessary or not;)
 * Convert jQuery deffered / promise object to ES2015 promise.
 *
 * @param dfd Target jQuery deferred / promise object
 */
export async function $d<T>(dfd: any): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    dfd.done((v: T) => resolve(v))
        .fail((err: any) => reject(err));
  });
}

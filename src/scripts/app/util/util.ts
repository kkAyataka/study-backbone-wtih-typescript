namespace Util {

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

  export async function $deferred<T>(dfd: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      dfd.done((v: T) => resolve(v))
         .fail((err: any) => reject(err));
    });
  }

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
}

export default Util;

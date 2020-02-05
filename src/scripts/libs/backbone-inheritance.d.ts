/** Backvbone.js */
declare module "backbone-inheritance" {
  /**
   * Backbone.View
   */
  export class View extends Events {
    constructor(opts: {el: string});
    protected initialize(): void;
    protected setElement(el: string): View;
    protected readonly el: any;
    protected readonly $el: any;
    protected events(): {[k: string]: Function | string};
  }

  /**
   * Backbone.Model
   */
  export class Model<T extends object> extends Events {
    constructor(attrs: T);
    protected set(attrs: Partial<T>, opts?: {silent: boolean}): void;
    protected get(attr: string): any;
    protected readonly attributes: T;
    readonly changed: {[k: string]: object};
  }

  /**
   * Backbone.Events
   */
  export class Events {
    on(event: string, callback: Function, context?: Object): void;
    off(event: string, callback: Function, context?: Object): void;
    listenTo(other: object, event: string, callback: Function): void;
  }
}

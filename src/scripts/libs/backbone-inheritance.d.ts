/** Backvbone.js */
declare module "backbone-inheritance" {
  /**
   * Backbone.Events
   */
  export class Events {
    on(event: string, callback: Function, context?: object): void;
    off(event: string, callback: Function, context?: object): void;
    listenTo(other: object, event: string, callback: Function): void;
  }

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
    protected get(attr: string): void;
    protected readonly attributes: T;
    readonly changed: {[k: string]: any};
  }
}

/** Backvbone.js */
declare module 'backbone-delegation' {
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
    constructor(
      opts: {
        el: string;
        events: Function | {[k: string]: Function | string};
      });
    // 'model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'
    public initialize(): void;
    public setElement(el: string): View;
    public readonly el: any;
    public readonly $el: any;
    public events(): {[k: string]: Function | string};
  }

  /**
   * Backbone.Model
   */
  export class Model<T extends object> extends Events {
    constructor(attrs: T);
    set(attrs: Partial<T>, opts?: {silent: boolean}): void;
    get(attr: string): any;
    readonly attributes: T;
    readonly changed: {[k: string]: object};
  }
}

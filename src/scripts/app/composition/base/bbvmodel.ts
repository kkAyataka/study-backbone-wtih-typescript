import * as Backbone from 'backbone-composition'

export class BBVModel <T extends object> {
  constructor(attrs: T) {
    this.raw_ = new Backbone.Model(attrs);
  }

  sayTo(view: Backbone.View, event: string, callback: Function): void {
    view.listenTo(this.raw_, event, callback);
  }

  value(newValue?: Partial<T>, opts?: {silent: boolean}): T {
    if (newValue) {
      this.raw_.set(newValue, opts);
    }

    return this.raw_.attributes;
  }

  private readonly raw_: Backbone.Model<T>;
}

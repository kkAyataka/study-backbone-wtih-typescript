import * as Backbone from 'backbone-inheritance';

export = class BBVModel<T extends object> extends Backbone.Model<T> {
  constructor(
    attrs?: T
  ) {
    super(attrs);
  }

  value(newValue?: Partial<T>, opts?: {silent: boolean}): T {
    if (newValue) {
      this.set(newValue, opts);
    }

    return this.attributes as T;
  }
}

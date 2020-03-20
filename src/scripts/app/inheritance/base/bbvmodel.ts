import * as Backbone from 'backbone-inheritance';

/**
 * Backbone Base View Model
 */
export class BBVModel<T extends object> extends Backbone.Model<T> {
  /**
   * @param attrs Initial attributes
   */
  constructor(attrs: T) {
    super(attrs);
  }

  /**
   * Setter and Getter to the attributes.
   * We can get type constraints for setting and getting value
   */
  value(newValue?: Partial<T>, opts?: {silent: boolean}): T {
    if (newValue) {
      this.set(newValue, opts);
    }

    return this.attributes;
  }
}

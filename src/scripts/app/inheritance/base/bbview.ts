import * as _ from 'underscore';
import * as Backbone from 'backbone-inheritance';
import {BBVModel} from './bbvmodel';
import * as DOMSyncer from '../../util/dom-syncer';

/**
 * Base view interface
 * Usually you do not use this class.
 *
 * This class does not depend to a view model type.
 * This class used for building abstract view structure.
 */
export interface BBBaseView {
  /** Render */
  render(value?: object): BBBaseView;

  /** Rendered root element */
  readonly rootElement: Element | null;

  /**
   * Reference value name in the parent view model.
   *
   * Render method is called with the value referenced
   * by the name in the parent view model.
   *
   * This referenced value is merged with view model
   * before rendering.
   */
  readonly valueName: string;
}

/**
 * Base View class binded a view model class
 */
export class BBView<T extends object> extends Backbone.View implements BBBaseView  {
  /**
   * @param opts
   * @param opts.el Selector string to the rendering target element
   * @param opts.valueName Referenced value name in the parent view model
   *   This value is used in BBBaseView. Refer to BBBaseView reference for details.
   * @param opts.templateText HTML template text. Underscore.js is used.
   * @param opts.vmodel View model
   */
  constructor(opts: {
    el: string;
    valueName?: string;
    templateText: string;
    vmodel: BBVModel<T>;
  }) {
    super(opts);

    this.el_ = opts.el;
    this.valueName = opts.valueName ?? '';
    this.template_ = _.template(DOMSyncer.embedRID(opts.templateText));
    this.vmodel = opts.vmodel;

    this.listenTo(this.vmodel, 'change', this.render);
  }

  /** Add view as sub view */
  addView<V extends BBBaseView>(view: V): V {
    this.views_.push(view);
    return view;
  }

  /** Remove view from the managed sub views */
  removeView<V extends BBBaseView>(view: V): V | null {
    const index = this.views_.indexOf(view);
    if (index >= 0) {
      this.views_.splice(index, 1);
      return view;
    } else {
      return null;
    }
  }

  /**
   * Render view in the HTML
   *
   * This method supports difference rendering.
   * If a rendering result of a lement is same as current,
   * current dom object is kept.
   *
   * This process is not efficient.
   * But dom object keeping is very useful.
   */
  render(value?: object): BBBaseView {
    this.ensureElement_();

    this.vmodel.value(value, {silent: true});

    const $nowEl = this.$el;
    const newEl = document.createElement('div');
    newEl.innerHTML = this.template_(this.vmodel.value());

    if ($nowEl[0].childElementCount === 0) {
      $nowEl.html(newEl.innerHTML);
    } else {
      DOMSyncer.sync($nowEl[0], this.getSubViewElements_(), newEl);
    }

    for (const view of this.views_) {
      view.render(this.vmodel.changed[view.valueName]);
    }

    return this;
  }

  /**
   * Ensures element.
   *
   * This method call Backbone.View#setElement.
   * Store/Restore el and $el object by selector string from current DOM objects,
   * and reset event handlers.
   */
  private ensureElement_(): void {
    this.setElement(this.el_);
  }

  /**
   * Gather sub view's Element objects.
   */
  private getSubViewElements_(): Element[] {
    const els: Element[] = [];
    for (const view of this.views_) {
      if (view.rootElement) {
        els.push(view.rootElement);
      }
    }

    return els;
  }

  /** implements BBBaseView */
  get rootElement(): Element | null {
    return (this.$el && this.$el.length > 0) ? this.$el[0] : null;
  }

  /** Implements BBBaseView */
  valueName: string;

  /** Element selector */
  private readonly el_: string;
  /** Result of the _.template */
  private readonly template_: Function;
  /** View model */
  protected readonly vmodel: BBVModel<T>;
  /** Sub views */
  private readonly views_: BBBaseView[] = [];
}

/**
 * Base View class for sub view component
 */
export abstract class BBViewComponent<VModelValue extends object, Value extends object> extends BBView<VModelValue> {
  constructor(
    params: {
      el: string;
      valueName?: string;
      templateText: string;
      vmodel: BBVModel<VModelValue>;
    }
  ) {
    super({
      el: params.el,
      valueName: params.valueName,
      templateText: params.templateText,
      vmodel: params.vmodel,
    });
  }

  /** Set value and Get value */
  value(newValue?: Value, opts?: {silent: false}): Value {
    if (newValue !== undefined) {
      this.vmodel.value(this.valueToVModel(newValue), opts);
    }

    return this.vmodelToValue(this.vmodel.value());
  }

  /** Triggers change:value event with current value. */
  protected triggerChangeValue(value?: Value): void {
    this.$el.trigger('change:value', value ?? this.value());
  }

  /**
   * This function call from value method for setting new value to vmodel.
   * @param value
   */
  protected abstract valueToVModel(value: Value): Partial<VModelValue>;

  /**
   * This function call from value method for getting return value from vmodel.
   * @param vmodel
   */
  protected abstract vmodelToValue(vmodel: VModelValue): Value;
}

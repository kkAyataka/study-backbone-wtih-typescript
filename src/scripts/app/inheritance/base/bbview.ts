import $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone-inheritance';
import BBVModel from './bbvmodel';
import DOMSyncer from '../../util/dom-syncer';

/**
 * Abstruct base view.
 * Usually you do not use this class.
 *
 * This class does not depend to a view model type.
 * This class used for building abstract view structure.
 */
export abstract class BBBaseView extends Backbone.View {
  /**
   * @param opts
   * @param opts.el Selector string to the rendering target element
   * @param opts.valueName Referenced value name in the parent view model
   */
  constructor(opts: {el: string, valueName?: string}) {
    super(opts);

    this.valueName = opts.valueName || '';
  }

  /** Render */
  abstract render(value?: any): BBBaseView;

  /** Rendered root element */
  get rootElement(): Element | null {
    return (this.$el && this.$el.length > 0) ? this.$el[0] : null;
  }

  /**
   * Reference value name in the parent view model.
   *
   * Render method is called with the value referenced
   * by the name in the parent view model.
   *
   * This referenced value is merged with view model
   * before rendering.
   */
  readonly valueName: string = '';
}

/**
 * Base View class binded a view model class
 */
export class BBView<T extends object> extends BBBaseView {
  /**
   * @param opts
   * @param opts.el Selector string to the rendering target element
   * @param opts.valueName Referenced value name in the parent view model
   *   This value is used in BBBaseView. Refer to BBBaseView reference for details.
   * @param opts.templateText HTML template text. Underscore.js is used.
   * @param opes.vmodel View model
   */
  constructor(opts: {
    el: string,
    valueName?: string,
    templateText: string,
    vmodel: BBVModel<T>,
  }) {
    super(opts);

    this.el_ = opts.el;
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
  render(value?: object): this {
    console.log(this.valueName, value);
    this.ensureElement_();

    this.vmodel.value(value, {silent: true});

    const $nowEl = this.$el;
    const $newEl = $('<div></div>').html(this.template_(this.vmodel.value()));

    if ($nowEl[0].childElementCount === 0) {
      $nowEl.html($newEl.html());
    } else {
      DOMSyncer.sync($nowEl[0], this.views_, $newEl[0]);
    }

    for (let view of this.views_) {
      console.log('subRender:', this.vmodel.changed[view.valueName]);
      view.render(this.vmodel.changed[view.valueName]);
    }

    return this;
  }

  /** Triggers change:value event with the VModel value */
  protected triggerChange(): void {
    if (Object.keys(this.vmodel.changed).length > 0) {
      this.$el.trigger('change:value', this.vmodel.value());
    }
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

  /** Element selector */
  private readonly el_: string;
  /** Result of the _.template */
  private readonly template_: Function;
  /** View model */
  protected readonly vmodel: BBVModel<T>;
  /** Sub views */
  private readonly views_: BBBaseView[] = [];
}

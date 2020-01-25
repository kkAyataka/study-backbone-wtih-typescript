import $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone-inheritance';
import BBVModel from './bbvmodel';
import DOMSyncer from '../../util/dom-syncer';

/**
 */
export abstract class BaseView extends Backbone.View {
  constructor(opts: {el: string, valueName?: string}) {
    super(opts);
    this.valueName = opts.valueName || '';
  }

  abstract render(value?: any): BaseView;

  rootElement(): Element {
    return this.$el[0];
  }

  readonly valueName: string = '';
}

/**
 */
export class BBView<T extends object> extends BaseView {
  static rid__ = 0;
  constructor(opts: {
    el: string,
    templateText: string,
    valueName?: string,
    vmodel: BBVModel<T>,
  }) {
    super(opts);

    this.el_ = opts.el;
    this.template_ = _.template(DOMSyncer.embedRID(opts.templateText));
    this.vmodel = opts.vmodel;

    this.listenTo(this.vmodel, 'change', this.render);
  }

  addView<V extends BaseView>(view: V): V {
    this.views_.push(view);
    return view;
  }

  removeView<V extends BaseView>(view: V): V | null {
    const index = this.views_.indexOf(view);
    if (index >= 0) {
      this.views_.splice(index, 1);
      return view;
    } else {
      return null;
    }
  }

  render(value?: object) {
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
      view.render(this.vmodel.changed[view.valueName]);
    }

    return this;
  }

  protected triggerChange(): void {
    if (Object.keys(this.vmodel.changed).length > 0) {
      this.$el.trigger('change:value', this.vmodel.value());
    }
  }

  private ensureElement_(): void {
    this.setElement(this.el_);
  }

  private readonly el_: string;
  private readonly template_: Function;
  protected readonly vmodel: BBVModel<T>;

  private readonly views_: BaseView[] = [];
}

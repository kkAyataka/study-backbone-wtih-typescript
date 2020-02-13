import * as _ from 'underscore';
import * as Backbone from 'backbone-composition';
import {BBVModel} from './bbvmodel';
import DOMSyncer from '../../util/dom-syncer';

interface BBBaseView {
  render(value?: object): this;
  readonly rootElement: Element | null;
  readonly valueName: string | null;
}

export class BBView<T extends object> implements BBBaseView {
  constructor(opts: {
    el: string,
    valueName?: string,
    templateText: string,
    vmodel: BBVModel<T>,
  }) {
    this.valueName = opts.valueName ?? null;

    this.raw_ = new Backbone.View({
      el: opts.el,
      events: this.createProxyEvents_(),
    });
    this.el_ = opts.el;
    this.template_ = _.template(DOMSyncer.embedRID(opts.templateText));
    this.views_ = [];
    this.vmodel = opts.vmodel;
    this.vmodel.sayTo(this.raw_, 'change', () => this.render());
  }

  createProxyEvents_() {
    const proxy: {[k: string]: Function} = {};
    const events = this.events();
    for (let e in events) {
      const func = events[e];
      if (func instanceof Function) {
        proxy[e] = (...args: any[]) => func(...args);
      }
    }

    return proxy;
  }

  render(value?: object): this {
    this.ensureElement_();

    this.vmodel.value(value, {silent: true});

    const $nowEl = this.raw_.$el;
    const newEl = document.createElement('div');
    newEl.innerHTML = this.template_(this.vmodel.value());

    if ($nowEl[0].childElementCount === 0) {
      $nowEl.html(newEl.innerHTML);
    } else {
      DOMSyncer.sync($nowEl[0], this.getSubViewElements_(), newEl);
    }

    return this;
  }

  private ensureElement_(): void {
    this.raw_.setElement(this.el_);
  }

  private getSubViewElements_(): Element[] {
    const els: Element[] = [];
    for (let view of this.views_) {
      if (view.rootElement) {
        els.push(view.rootElement);
      }
    }

    return els;
  }

  get rootElement(): Element | null {
    return (this.raw_.$el && this.raw_.$el.length > 0) ? this.raw_.$el[0] : null;
  }

  readonly valueName: string | null;

  protected events(): {[k: string]: Function | string} {
    return {};
  }

  protected readonly vmodel: BBVModel<T>;

  private readonly raw_: Backbone.View;
  private readonly el_: string;
  private readonly template_: Function;
  private readonly views_: BBBaseView[];
}

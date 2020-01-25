import $ from 'jquery';
import * as _ from 'underscore';
import * as Backbone from 'backbone-inheritance';
import BBVModel from './bbvmodel';

/**
 */
abstract class BaseView extends Backbone.View {
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
export = class BBView<T extends object> extends BaseView {
  static rid__ = 0;
  constructor(opts: {
    el: string,
    templateText: string,
    valueName?: string,
    vmodel: BBVModel<T>,
  }) {
    super(opts);

    this.el_ = opts.el;
    this.templateText_ = this.pinRID_(opts.templateText);
    this.template_ = _.template(this.templateText_);
    this.vmodel = opts.vmodel;

    this.listenTo(this.vmodel, 'change', this.render);
  }

  private pinRID_(templateText: string) {
    return templateText.replace(/<([^/%]("(.|\s)*?"|'(.|\s)*?'|<%(.|\s)*?%>|[^"'])*?)>/g,
      (m, p1) => `<${p1} r-id=${BBView.rid__++}>`)
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

    const $el = $('<div></div>').html(this.template_(this.vmodel.value()));

    if (this.$el[0].childElementCount === 0) {
      this.$el.html(this.template_(this.vmodel.value()));
    } else {
      this.compare($el[0], this.$el[0], 0);
    }

    for (let view of this.views_) {
      view.render(this.vmodel.changed[view.valueName]);
    }

    return this;
  }

  getRIDValue_(e: Element): string | null {
    const item = e.attributes.getNamedItem('r-id');
    return item ? item.value : null;
  }

  getChildByRID_(el: Element, rid: string): Element | null {
    for (let c of el.children) {
      if (this.getRIDValue_(c) === rid) {
        return c;
      }
    }
    return null;
  }

  compare(newEl: Element, nowEl: Element, depth: number): boolean {
    if (newEl.children.length === 0) {
      for (let a of newEl.attributes) {
        nowEl.setAttribute(a.name, a.value);
      }
      return newEl.outerHTML === nowEl.outerHTML;
    } else {
      let isSame = true;
      for (let i = 0; i < newEl.childElementCount; ++i) {
        const newC = newEl.children[i];
        const rid =  this.getRIDValue_(newC);
        if (rid) {
          const nowC = this.getChildByRID_(nowEl, rid);
          if (nowC) {
            const r = this.compare(newC, nowC, depth);
            if (!r && !this.isSubView_(nowC)) {
              console.log(nowC);
              nowC.outerHTML = newC.outerHTML;
            }
            isSame =  r && isSame;
          } else {
            nowEl.insertBefore(newC, nowEl.children[i]);
          }
        }
      }

      return isSame;
    }
  }

  private isSubView_(el: Element): boolean {
    for (let view of this.views_) {
      if (view.rootElement() === el) {
        return true;
      }
    }

    return false;
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
  private readonly templateText_: string;
  protected readonly vmodel: BBVModel<T>;

  private readonly views_: BaseView[] = [];
}

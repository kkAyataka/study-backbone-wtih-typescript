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

  readonly valueName: string = '';
}

/**
 */
export = class BBView<T extends object> extends BaseView {
  constructor(opts: {
    el: string,
    templateText: string,
    valueName?: string,
    vmodel: BBVModel<T>,
  }) {
    super(opts);

    this.el_ = opts.el;
    this.template_ = _.template(opts.templateText);
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

    this.$el.html(this.template_(this.vmodel.value()));

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

import BBView from '../base/bbview';
import BBVModel from '../base/bbvmodel';
import templateText from 'text!./sub-view.template';

export interface Value {
  value: number;
}

class VModel {
  isEnabled: boolean = false;
  value: Partial<Value> = {
    value: 11,
  };
}

export class View extends BBView<VModel> {
  constructor(opts: {el: string, valueName?: string}) {
    super({
      el: opts.el,
      valueName:  opts.valueName,
      templateText,
      vmodel: new BBVModel(new VModel),
    });
  }

  events(): {[k: string]: Function} {
    return {
      'input #num-input': (eve: any) => {
        console.log(eve);
        const v = parseInt(eve.target.value);
        this.vmodel.value({
          isEnabled: v > 0,
          value: {
            value: v,
          },
        });
      },

      'click #sub-input-btn': (eve: any) => {
        console.log(eve);
        this.triggerChangeValue(this.vmodel.value().value);
      },
    }
  }
}

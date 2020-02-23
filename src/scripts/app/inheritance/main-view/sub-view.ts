import * as $ from 'jquery';
import {BBView} from '../base/bbview';
import BBVModel from '../base/bbvmodel';
import templateText from 'text!app/inheritance/main-view/sub-view.template';


export interface SubViewValue {
  value: number;
}

/**
 */
export class VModel {
  value: SubViewValue = {
    value: 0,
  }
}

/**
 */
export class SubView extends BBView<VModel> {
  constructor(el: string, valueName?: string) {
    super({el, templateText, valueName, vmodel: new BBVModel(new VModel())});
  }

  events(): {[k: string]: Function | string} {
    return {
      'input #sub-value': (eve: $.Event<HTMLInputElement>): void => {
        const v = parseInt(eve.target.value);
        this.vmodel.value({value: {value: v}}, {silent: true});

        this.triggerChange();
      },
    }
  }
}

export default SubView;

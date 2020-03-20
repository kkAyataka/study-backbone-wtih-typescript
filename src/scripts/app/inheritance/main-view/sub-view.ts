import * as $ from 'jquery';
import {BBViewComponent} from '../base/bbview';
import {BBVModel} from '../base/bbvmodel';
import templateText from 'text!app/inheritance/main-view/sub-view.template';

/** */
export interface SubViewValue {
  value: number;
}

/** */
class VModel {
  value = 0;
}

/**
 */
export class SubView extends BBViewComponent<VModel, SubViewValue> {
  constructor(el: string, valueName?: string) {
    super({el, templateText, valueName, vmodel: new BBVModel(new VModel())});
  }

  /** @override */
  protected valueToVModel(newValue: SubViewValue): Partial<VModel> {
    return {value: newValue.value};
  }

  /** @override */
  protected vmodelToValue(vmodel: VModel): SubViewValue {
    return {value: vmodel.value};
  }

  events(): {[k: string]: Function | string} {
    return {
      'input #sub-value': (eve: $.Event<HTMLInputElement>): void => {
        const v = parseInt(eve.target.value);
        this.vmodel.value({value: v}, {silent: true});

        this.triggerChangeValue();
      },
    };
  }
}

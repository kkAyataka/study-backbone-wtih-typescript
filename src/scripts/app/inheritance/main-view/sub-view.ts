import {BBView} from '../base/bbview';
import BBVModel from '../base/bbvmodel';
import templateText from 'text!app/inheritance/main-view/sub-view.template';

namespace SubView {

export class VModel {
  value: number = 0;
}

export class View extends BBView<VModel> {
  constructor(el: string, valueName?:string) {
    super({el, templateText, valueName, vmodel: new BBVModel(new VModel())});
  }

  events() {
    return {
      'input #sub-value': (eve: any) => {
        const v = parseInt(eve.target.value);
        this.vmodel.value({value: v}, {silent: true});

        this.triggerChange();
      },
    }
  }
}

}

export default SubView;

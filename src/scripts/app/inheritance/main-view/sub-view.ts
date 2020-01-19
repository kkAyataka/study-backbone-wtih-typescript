import BBView from '../base/bbview';
import BBVModel from '../base/bbvmodel';
import templateText from 'text!app/inheritance/main-view/sub-view.template';

export class SubViewVModel {
  value: number = 0;
}

export class SubView extends BBView<SubViewVModel> {
  static VModel = SubViewVModel;
  static num: number = 0;

  constructor(el: string, valueName?:string) {
    super({el, templateText, valueName, vmodel: new BBVModel(new SubViewVModel())});
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

export default SubView;

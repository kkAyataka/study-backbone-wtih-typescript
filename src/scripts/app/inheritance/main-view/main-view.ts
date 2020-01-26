import {BBView} from '../base/bbview';
import BBVModel from '../base/bbvmodel';
import SubView from './sub-view';
import templateText from 'text!app/inheritance/main-view/main-view.template'

class VModel {
  text: string = '';
  num: number = 0;
  enable: boolean = false;
  subView: Partial<SubView.VModel> = {
    value: 0,
  };
}

new (class MainView extends BBView<VModel> {
  constructor(el: string) {
    super({el, templateText, vmodel: new BBVModel(new VModel())});

    this.addView(new SubView.View('#sub-view', 'subView'));
  }

  start() {
    this.render();
  }

  events() {
    return {
      'click #button': () => {
        console.log('click #button');
      },

      'input #text': (eve: any) => {
        this.vmodel.value({
          text: eve.target.value,
          enable: eve.target.value.length > 0,
        }, {silent: false});
      },

      'change:value #sub-view': (eve: any, extra: SubView.VModel) => {
        console.log(extra);
      },
    };
  }
})('#content').start();

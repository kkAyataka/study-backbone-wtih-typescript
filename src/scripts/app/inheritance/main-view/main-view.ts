import {BBView} from '../base/bbview';
import BBVModel from '../base/bbvmodel';
import {SubView, SubViewVModel} from './sub-view';
import templateText from 'text!app/inheritance/main-view/main-view.template'

class VModel {
  text: string = 'test';
  num: number = 0;
  enable: boolean = false;
  subView = {
    value: 0,
    enable: true,
  }
}

new (class MainView extends BBView<VModel> {
  constructor(el: string) {
    super({el, templateText,
      valueName: 'subView',
      vmodel: new BBVModel(new VModel())});

    this.addView(new SubView('#sub-view'));
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
        }, {silent:false});
      },

      'change:value #sub-view': (eve: any, extra: SubViewVModel) => {
        console.log(extra.value);
      },
    };
  }
})('#content').start();

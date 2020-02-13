import {BBVModel} from '../base/bbvmodel';
import {BBView} from '../base/bbview';
import templateText from 'text!./main-view.template';

class VModel {
  text: string = 'text';
}

new (class MainView extends BBView<VModel> {
  constructor(el: string) {
    super({el, templateText, vmodel: new BBVModel(new VModel())});
  }

  events(): {[k: string]: Function | string} {
    return {
      'input #text-input': (eve: any) => {
        console.log(this.vmodel.value({text: eve.target.value}));
      },

      'click #btn': (eve: object) => {
        console.log(eve);
      },
    }
  }

  start() {
    this.render();
  }
})('#content').start();

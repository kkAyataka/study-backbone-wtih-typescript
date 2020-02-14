import {BBVModel} from '../base/bbvmodel';
import {BBView} from '../base/bbview';
import templateText from 'text!./main-view.template';
import * as SubView from './sub-view';
import cl from '../../util/console-logger';

class VModel {
  text: string = 'text';
}

new (class MainView extends BBView<VModel> {
  constructor(el: string) {
    super({el, templateText, vmodel: new BBVModel(new VModel())});

    this.addView(new SubView.View({el: '#sub-view'}));
  }

  events(): {[k: string]: Function | string} {
    return {
      'input #text-input': (eve: any) => {
        console.log(this.vmodel.value({text: eve.target.value}));
      },

      'click #btn': (eve: object) => {
        cl.trace();
      },

      'change:value #sub-view': (eve: object, value: SubView.Value) => {
        cl.trace();
      },
    }
  }

  start() {
    this.render();
  }
})('#content').start();

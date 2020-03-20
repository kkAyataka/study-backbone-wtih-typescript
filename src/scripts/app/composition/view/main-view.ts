import {BBVModel} from '../base/bbvmodel';
import {BBView} from '../base/bbview';
import templateText from 'text!./main-view.template';
import * as SubView from './sub-view';
import * as cl from '../../util/console-logger';

class VModel {
  text = 'text';
}

new (class MainView extends BBView<VModel> {
  constructor(el: string) {
    super({el, templateText, vmodel: new BBVModel(new VModel())});

    this.addView(new SubView.View({el: '#sub-view'}));
  }

  events(): {[k: string]: Function | string} {
    return {
      'input #text-input': (eve: any): void => {
        console.log(this.vmodel.value({text: eve.target.value}));
      },

      'click #btn': (): void => {
        cl.infoTrace();
      },

      'change:value #sub-view': (eve: object, value: SubView.Value): void => {
        cl.infoTrace();
      },
    };
  }

  start(): void {
    this.render();
  }
})('#content').start();

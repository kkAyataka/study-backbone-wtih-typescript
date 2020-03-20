import * as $ from 'jquery';
import {BBView} from '../base/bbview';
import {BBVModel} from '../base/bbvmodel';
import {SubView, SubViewValue} from './sub-view';
import templateText from 'text!app/inheritance/main-view/main-view.template';
import * as Util from '../../util/util';

class VModel {
  text = '';
  num = 0;
  enable = false;
  subView: Partial<SubViewValue> = {
    value: 0,
  };
}

/**
 * @category View
 */
export class MainView extends BBView<VModel> {
  constructor(el: string) {
    super({el, templateText, vmodel: new BBVModel(new VModel())});

    this.addView(new SubView('#sub-view', 'subView'));
  }

  start(): void {
    this.render();
  }

  events(): {[k: string]: Function | string} {
    return {
      'click #button': async (): Promise<void> => {
        console.log('click #button');

        try {
          await Util.sleep(1000);
          console.log('sleeped');

          const r = await Util.ignoreError(new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(101);
            }, 1000);
          }));
          console.log(r);

        } catch (err) {
          console.log(err);
        }
      },

      'input #text': (eve: $.Event<HTMLInputElement>): void => {
        this.vmodel.value({
          text: eve.target.value,
          enable: eve.target.value.length > 0,
        }, {silent: false});
      },

      'change:value #sub-view': (eve: $.Event<HTMLElement>, extra: SubViewValue): void => {
        console.log(extra);
      },
    };
  }
}

new MainView('#content').start();

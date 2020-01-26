import {BBBaseView} from '../inheritance/base/bbview';

/**
 * Attribute name of the rid
 * @private
 */
const ATTR_NAME_RID = 'domsync-rid';

/**
 * Managed embedded rid
 * @private
 */
let g_rid: number = 0;

export namespace DOMSyncer {
  /**
   * Embed rendering id (rid) to the HTML elements.
   * e.g. <div></div> -> <div domsync-rid="0">
   * @param templateText
   */
  export function embedRID(templateText: string): string {
    return templateText.replace(/<([^/%]("(.|\s)*?"|'(.|\s)*?'|<%(.|\s)*?%>|[^"'])*?)>/g,
      (m, p1) => `<${p1} ${ATTR_NAME_RID}="${g_rid++}">`);
  }

  /**
   *
   * @param nowEl
   * @param subViews
   * @param newEl
   */
  export function sync(nowEl: Element, subViews: BBBaseView[], newEl: Element): void {
    syncElements(nowEl, subViews, newEl);
  }

  /** Implementation of the sync function @private */
  function syncElements(nowEl: Element, subViews: BBBaseView[], newEl: Element): boolean {
    if (newEl.childElementCount === 0 && nowEl.childElementCount === 0) {
      syncAttributes(nowEl, newEl);
      return nowEl.outerHTML === newEl.outerHTML;
    } else if (newEl.childElementCount === 0) {
      return false;
    } else {
      let isSame = true;

      for (let i = 0; i < newEl.childElementCount; ++i) {
        const newC = newEl.children[i];
        const newRID =  getRID(newC);

        if (newRID) {
          const child = getChildByRID(nowEl, newRID, i);
          const nowC = child?.el;
          const nowI = child?.index;

          if (nowC && nowI === i) {
            const r = syncElements(nowC, subViews, newC);
            if (!r && !isSubView(subViews, nowC)) {
              nowC.outerHTML = newC.outerHTML;
            }
            isSame =  r && isSame;
          } else if (nowC) {
            // nowEl.children[i] is none in now
            nowEl.children[i].remove();
          } else {
            nowEl.insertBefore(newC, nowEl.children[i]);
          }
        }
      }

      return isSame;
    }
  }

  /** Copies attributes @private */
  function syncAttributes(nowEl: Element, newEl: Element) {
    // update existing attributes
    for (let attr of nowEl.attributes) {
      const item = newEl.attributes.getNamedItem(attr.name);
      if (item) {
        nowEl.setAttribute(attr.name, item.value);
      } else {
        nowEl.removeAttribute(attr.name);
      }
    }

    // Adds new attributes
    for (let attr of newEl.attributes) {
      const item = nowEl.attributes.getNamedItem(attr.name);
      if (!item) {
        nowEl.setAttribute(attr.name, attr.value);
      }
    }
  }

  /** Gets a rid from the attributes @private */
  function getRID(el: Element): string | null {
    const item = el.attributes.getNamedItem(ATTR_NAME_RID);
    return item ? item.value : null;
  }

  /** Gets a child element by the rid @private */
  function getChildByRID(el: Element, rid: string, offset = 0): {el: Element, index: number} | null {
    for (let i = offset; i < el.childElementCount; ++i) {
      if (getRID(el.children[i]) === rid) {
        return {el: el.children[i], index: i};
      }
    }

    return null;
  }

  /** Checks whether the element is a sub view or not @private */
  function isSubView(subViews: BBBaseView[], el: Element): boolean {
    for (let view of subViews) {
      if (view.rootElement === el) {
        return true;
      }
    }

    return false;
  }
}

export default DOMSyncer;

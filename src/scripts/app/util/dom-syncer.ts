/**
 * Attribute name of the rid
 */
const ATTR_NAME_RID = 'data-domsyncer-rid';

/**
 * Attributes name of the no sync marker
 */
const ATTR_NO_SYNC = 'data-domsyncer-no';

/**
 * Managed embedded rid
 */
let rid = 0;


/** Copies attributes @private */
function syncAttributes(nowEl: Element, newEl: Element): void {
  // update existing attributes
  for (const attr of nowEl.attributes) {
    const item = newEl.attributes.getNamedItem(attr.name);
    if (item) {
      nowEl.setAttribute(attr.name, item.value);
    } else if (
      attr.name !== 'id' &&
      attr.name !== ATTR_NAME_RID) {

      nowEl.removeAttribute(attr.name);
    }
  }

  // Adds new attributes
  for (const attr of newEl.attributes) {
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

/** @private */
function isNoSync(el: Element): boolean {
  const item = el.attributes.getNamedItem(ATTR_NO_SYNC);
  return item ? true : false;
}

/** Gets a child element by the rid @private */
function getChildByRID(el: Element, rid: string, offset = 0): {el: Element; index: number} | null {
  for (let i = offset; i < el.childElementCount; ++i) {
    if (getRID(el.children[i]) === rid) {
      return {el: el.children[i], index: i};
    }
  }

  return null;
}

/** Implementation of the sync function @private */
function syncElements(nowEl: Element, subViewEls: Element[], newEl: Element): void {
  syncAttributes(nowEl, newEl);

  if (isNoSync(nowEl)) {
    nowEl.outerHTML = newEl.outerHTML;
  } else if (nowEl.childElementCount === 0) {
    if (newEl.childElementCount > 0) {
      for (const c of newEl.children) {
        nowEl.appendChild(c);
      }
    }

    if (nowEl.outerHTML !== newEl.outerHTML) {
      nowEl.outerHTML = newEl.outerHTML;
    }
  } else {
    for (let i = 0; i < newEl.childElementCount; ++i) {
      const newC = newEl.children[i];
      const newRID = getRID(newC);

      if (newRID) {
        const child = getChildByRID(nowEl, newRID, i);
        const nowC = child?.el;
        const nowI = child?.index;

        if (nowC) {
          if (!subViewEls.includes(newC)) {
            syncElements(nowC, subViewEls, newC);
          }
        } else {
          nowEl.insertBefore(newC, nowEl.children[i]);
        }

        if (nowC && nowI !== i) {
          // nowEl.children[i] is none in now
          nowEl.children[i].remove();
        }
      } else {
        nowEl.insertBefore(newC, nowEl.children[i]);
      }
    }
  }
}

/**
 * Embed rendering id (rid) to the HTML elements.
 *
 * ```html
 * <div></div> -> <div data-domsyncerid="0">
 * ```
 * @param templateText
 */
export function embedRID(templateText: string): string {
  return templateText.replace(/<([^/%]("(.|\s)*?"|'(.|\s)*?'|<%(.|\s)*?%>|[^"'<])*?)(?<!%)>/g,
    (m, p1) => `<${p1} ${ATTR_NAME_RID}="${rid++}">`);
}

/**
 *
 * @param nowEl
 * @param subViewEls
 * @param newEl
 */
export function sync(nowEl: Element, subViewEls: Element[], newEl: Element): void {
  syncElements(nowEl, subViewEls, newEl);
}

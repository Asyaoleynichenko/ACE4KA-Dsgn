/**
 * Sticker.js — ES module adaptation for rectangular React cards
 * @see https://github.com/cmiscm/stickerjs
 * @license MIT
 */

const _prefixes = ['webkit', 'Moz', 'ms', 'O'];
const _aniTrans = 'all 0.6s cubic-bezier(.23,1,.32,1)';
const _setTrans = 'all 0s';
const _styleId = 'stickerjs-shadow-styles';

function ensureShadowStyles() {
  if (document.getElementById(_styleId)) return;
  const style = document.createElement('style');
  style.id = _styleId;
  style.textContent = `
    .shadowL { background: linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%); }
    .shadowR { background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%); }
    .shadowB { background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%); }
    .shadowT { background: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%); }
  `;
  document.head.appendChild(style);
}

function vendor(el, prop) {
  const s = el.style;
  const capitalized = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (let i = 0; i < _prefixes.length; i += 1) {
    const prefixed = _prefixes[i] + capitalized;
    if (s[prefixed] !== undefined) return prefixed;
  }
  if (s[prop] !== undefined) return prop;
  return prop;
}

function css(el, prop = {}) {
  Object.keys(prop).forEach((name) => {
    el.style[vendor(el, name) || name] = prop[name];
  });
}

function createEl(tag, prop = {}) {
  const el = document.createElement(tag || 'div');
  css(el, prop);
  return el;
}

function checkDirection(e, pos, width, height, options) {
  const tx = e.pageX - pos.x;
  const ty = e.pageY - pos.y;

  if (options.corner === 'bottom-right') {
    if (options.interactionEl) {
      return tx / width >= ty / height ? 1 : 3;
    }
    if (tx < width * 0.52 || ty < height * 0.52) return null;
    return tx / width >= ty / height ? 1 : 3;
  }

  const wQ = width >> 2;
  const hQ = height >> 2;
  if (tx < wQ) return 0;
  if (tx > width - wQ) return 1;
  if (ty < hQ) return 2;
  return 3;
}

function checkPos(e, pos, width, height, direction) {
  const tx = e.pageX - pos.x;
  const ty = e.pageY - pos.y;
  const a = width - tx;
  const b = height - ty;
  const c = tx >> 1;
  const d = ty >> 1;
  const edgeRight = a >> 1;
  const edgeBottom = b >> 1;

  if (direction === 0) {
    return {
      bx: -width,
      by: 0,
      sx: -1,
      sy: 1,
      bs: 'shadowL',
      bmx: -width + tx,
      bmy: 0,
      bsw: tx,
      bsh: height,
      bsx: a,
      bsy: 0,
      cw: width - c,
      ch: height,
      cx: c,
      cy: 0,
      dw: c,
      dh: height,
      dx: c - (c >> 1),
      dy: 0,
    };
  }

  if (direction === 1) {
    return {
      bx: width,
      by: 0,
      sx: -1,
      sy: 1,
      bs: 'shadowR',
      bmx: tx,
      bmy: 0,
      bsw: a,
      bsh: height,
      bsx: 0,
      bsy: 0,
      cw: width - edgeRight,
      ch: height,
      cx: 0,
      cy: 0,
      dw: edgeRight,
      dh: height,
      dx: width - a + (edgeRight >> 1),
      dy: 0,
    };
  }

  if (direction === 2) {
    return {
      bx: 0,
      by: -height,
      sx: 1,
      sy: -1,
      bs: 'shadowT',
      bmx: 0,
      bmy: -height + ty,
      bsw: width,
      bsh: ty,
      bsx: 0,
      bsy: b,
      cw: width,
      ch: height - d,
      cx: 0,
      cy: d,
      dw: width,
      dh: d,
      dx: 0,
      dy: d - (d >> 1),
    };
  }

  return {
    bx: 0,
    by: height,
    sx: 1,
    sy: -1,
    bs: 'shadowB',
    bmx: 0,
    bmy: ty,
    bsw: width,
    bsh: b,
    bsx: 0,
    bsy: 0,
    cw: width,
    ch: height - edgeBottom,
    cx: 0,
    cy: 0,
    dw: width,
    dh: edgeBottom,
    dx: 0,
    dy: height - b + (edgeBottom >> 1),
  };
}

function onEnter(e, value) {
  const cpos = value.container.getBoundingClientRect();
  const mpos = { x: cpos.left + window.pageXOffset, y: cpos.top + window.pageYOffset };
  const direction = checkDirection(e, mpos, value.width, value.height, value.options);

  if (direction == null) {
    value.savePos = null;
    value.direction = null;
    return;
  }

  value.direction = direction;
  value.savePos = checkPos(e, mpos, value.width, value.height, direction);
  value.savePos.pos = mpos;

  const { bx, by, sx, sy, bs } = value.savePos;
  value.backShadow.className = `sticker-shadow ${bs}`;
  value.depth.className = 'sticker-shadow';

  css(value.mask, {
    transition: _setTrans,
    width: `${value.width}px`,
    height: `${value.height}px`,
    transform: 'translate(0px, 0px)',
  });
  css(value.move, { transition: _setTrans, transform: 'translate(0px, 0px)' });
  css(value.back, { transition: _setTrans, transform: `translate(${bx}px, ${by}px)` });
  css(value.backImg, { transform: `scaleX(${sx}) scaleY(${sy})` });
  if (value.peelLabelWrap) {
    css(value.peelLabelWrap, {
      transform:
        sx === -1 && sy === 1 ? 'scaleX(-1)' : sx === 1 && sy === -1 ? 'scaleY(-1)' : 'none',
    });
  }
  css(value.depth, { transform: 'translate(-10000px, -10000px)' });
}

function onLeave(value) {
  if (value.savePos == null) return;
  const { bx, by } = value.savePos;

  css(value.mask, {
    transition: _aniTrans,
    width: `${value.width}px`,
    height: `${value.height}px`,
    transform: 'translate(0px, 0px)',
  });
  css(value.move, { transition: _aniTrans, transform: 'translate(0px, 0px)' });
  css(value.back, { transition: _aniTrans, transform: `translate(${bx}px, ${by}px)` });
  css(value.depth, { transform: 'translate(-10000px, -10000px)' });

  value.savePos = null;
  value.direction = null;
}

function onMove(e, value) {
  if (value.savePos == null) {
    onEnter(e, value);
    if (value.savePos == null) return;

    const onMouseUp = (upEvent) => {
      document.removeEventListener('mouseup', onMouseUp, false);
      onLeave(value);
    };
    document.addEventListener('mouseup', onMouseUp, false);
  }

  const pos = checkPos(e, value.savePos.pos, value.width, value.height, value.direction);
  css(value.mask, {
    width: `${pos.cw}px`,
    height: `${pos.ch}px`,
    transform: `translate(${pos.cx}px, ${pos.cy}px)`,
  });
  css(value.move, { transform: `translate(${-pos.cx}px, ${-pos.cy}px)` });
  css(value.back, { transform: `translate(${pos.bmx}px, ${pos.bmy}px)` });
  css(value.backShadow, {
    width: `${pos.bsw}px`,
    height: `${pos.bsh}px`,
    transform: `translate(${pos.bsx}px, ${pos.bsy}px)`,
  });
  css(value.depth, {
    width: `${pos.dw}px`,
    height: `${pos.dh}px`,
    transform: `translate(${pos.dx}px, ${pos.dy}px)`,
  });
}

function bindSticker(dom, options = {}) {
  if (dom._stickerValue) return dom._stickerValue;

  ensureShadowStyles();

  const rect = dom.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  const borderRadius = options.borderRadius || '50%';
  const backColor = options.backColor || '#ffffff';

  const frontChildren = [...dom.childNodes];
  const radiusStyle = { borderRadius };

  const container = createEl('div', {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
  });
  const mask = createEl('div', {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
  });
  const move = createEl('div', {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    ...radiusStyle,
  });
  const front = createEl('div', {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    zIndex: 1,
    ...radiusStyle,
  });
  const back = createEl('div', {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    left: '0',
    top: '0',
    zIndex: 3,
    backgroundColor: backColor,
    transform: `translate(${width}px, 0px)`,
    overflow: 'hidden',
    ...radiusStyle,
  });
  const backImg = createEl('div', {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    ...radiusStyle,
  });
  const backShadow = createEl('div', {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    left: '0',
    top: '0',
    zIndex: 4,
  });
  const depth = createEl('div', {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    left: '0',
    top: '0',
    zIndex: 1,
  });

  front.className = 'sticker-img sticker-front';
  backImg.className = 'sticker-img sticker-back';
  backShadow.className = 'sticker-shadow';
  depth.className = 'sticker-shadow';

  frontChildren.forEach((node) => front.appendChild(node));

  let peelLabelWrap = null;
  if (options.peelLabel) {
    peelLabelWrap = createEl('div', {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
      WebkitClipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
      overflow: 'hidden',
    });
    const label = createEl('span');
    label.className = 'about-job__peel-label';
    label.textContent = options.peelLabel;
    peelLabelWrap.appendChild(label);
    backImg.appendChild(peelLabelWrap);
  }

  dom.appendChild(container);
  container.appendChild(mask);
  mask.appendChild(move);
  move.appendChild(front);
  move.appendChild(depth);
  move.appendChild(back);
  back.appendChild(backImg);
  back.appendChild(backShadow);

  const value = {
    dom,
    options,
    interactionEl: options.interactionEl || null,
    container,
    width,
    height,
    mask,
    move,
    depth,
    back,
    backImg,
    backShadow,
    peelLabelWrap,
    direction: null,
    savePos: null,
  };

  const eventTarget = options.interactionEl || dom;

  const onMouseEnter = (event) => onEnter(event, value);
  const onMouseLeave = () => onLeave(value);
  const onMouseMove = (event) => onMove(event, value);

  eventTarget.addEventListener('mouseenter', onMouseEnter, false);
  eventTarget.addEventListener('mouseleave', onMouseLeave, false);
  eventTarget.addEventListener('mousemove', onMouseMove, false);

  value.handlers = { onMouseEnter, onMouseLeave, onMouseMove, eventTarget };
  dom._stickerValue = value;

  return value;
}

const Sticker = {
  init(target, options = {}) {
    if (typeof target === 'string') {
      document.querySelectorAll(target).forEach((node) => bindSticker(node, options));
      return Sticker;
    }
    bindSticker(target, options);
    return Sticker;
  },

  destroy(dom) {
    const value = dom?._stickerValue;
    if (!value) return;

    const { handlers } = value;
    const { eventTarget } = handlers;
    eventTarget.removeEventListener('mouseenter', handlers.onMouseEnter, false);
    eventTarget.removeEventListener('mouseleave', handlers.onMouseLeave, false);
    eventTarget.removeEventListener('mousemove', handlers.onMouseMove, false);

    const front = dom.querySelector('.sticker-front');
    if (front) {
      [...front.childNodes].forEach((node) => dom.insertBefore(node, value.container));
    }

    value.container.remove();
    delete dom._stickerValue;
  },
};

export default Sticker;

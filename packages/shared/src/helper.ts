/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * Returns true if `value` is neither null nor undefined, else returns false.
 * @param {*} value - The value to test.
 * @returns {boolean}
 * @since 2.7.0
 */
export function isNullOrUndef(value: any) {
  return value === null || typeof value === 'undefined';
}

export function isEmpty(value: any, IncludeNullUndefined = true) {
  return value === '' || (IncludeNullUndefined ? isNullOrUndef(value) : false);
}

/**
 * Returns true if `value` is an array (including typed arrays), else returns false.
 * @param {*} value - The value to test.
 * @returns {boolean}
 * @function
 */
export function isArray(value: any) {
  if (Array.isArray(value)) {
    return true;
  }
  const type = Object.prototype.toString.call(value);
  if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
    return true;
  }
  return false;
}

/**
 * Returns true if `value` is an object (excluding null), else returns false.
 * @param {*} value - The value to test.
 * @returns {boolean}
 * @since 2.7.0
 */
export function isObject(value: any) {
  return value !== null && /^\[object (Object|Module|Promise)\]/.test(Object.prototype.toString.call(value));
}

/**
 * Returns true if `value` is a finite number, else returns false
 * @param {*} value  - The value to test.
 * @returns {boolean}
 */
const isNumberFinite = (value: any) => (typeof value === 'number' || value instanceof Number) && isFinite(+value);
export { isNumberFinite as isFinite };

/**
 * Returns `value` if finite, else returns `defaultValue`.
 * @param {*} value - The value to return if defined.
 * @param {*} defaultValue - The value to return if `value` is not finite.
 * @returns {*}
 */
export function finiteOrDefault(value: any, defaultValue: any) {
  return isNumberFinite(value) ? value : defaultValue;
}

/**
 * Returns `value` if defined, else returns `defaultValue`.
 * @param {*} value - The value to return if defined.
 * @param {*} defaultValue - The value to return if `value` is undefined.
 * @returns {*}
 */
export function valueOrDefault(value: any, defaultValue: any) {
  return typeof value === 'undefined' ? defaultValue : value;
}

/**
 * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
 * @param {Array} a0 - The array to compare
 * @param {Array} a1 - The array to compare
 * @returns {boolean}
 * @private
 */
export function elementsEqual(a0: any, a1: any) {
  let i;
  let ilen;
  let v0;
  let v1;

  if (!a0 || !a1 || a0.length !== a1.length) {
    return false;
  }

  for (i = 0, ilen = a0.length; i < ilen; ++i) {
    v0 = a0[i];
    v1 = a1[i];

    if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
      return false;
    }
  }

  return true;
}

/**
 * Returns a deep copy of `source` without keeping references on objects and arrays.
 * @param {*} source - The value to clone.
 * @returns {*}
 */
export function clone(source: any) {
  if (isArray(source)) {
    return source.map(clone);
  }

  if (isObject(source)) {
    const target = Object.create(null);
    const keys = Object.keys(source);
    const klen = keys.length;
    let k = 0;

    for (; k < klen; ++k) {
      target[keys[k]] = clone(source[keys[k]]);
    }

    return target;
  }

  return source;
}

function isValidKey(key: any) {
  return ['__proto__', 'prototype', 'constructor'].indexOf(key) === -1;
}

/**
 * The default merger when Chart.helpers.merge is called without merger option.
 * Note(SB): also used by mergeConfig and mergeScaleConfig as fallback.
 * @private
 */
export function mergerFn(key: string, target: any, source: any, options: any) {
  if (!isValidKey(key)) {
    return;
  }

  const tval = target[key];
  const sval = source[key];

  if (isObject(tval) && isObject(sval)) {
    merge(tval, sval, options);
  } else {
    target[key] = clone(sval);
  }
}

/**
 * Recursively deep copies `source` properties into `target` with the given `options`.
 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
 * @param {object} target - The target object in which all sources are merged into.
 * @param {object|object[]} source - Object(s) to merge into `target`.
 * @param {object} [options] - Merging options:
 * @param {function} [options.merger] - The merge method (key, target, source, options)
 * @returns {object} The `target` object.
 */
export function merge(target: any, source: any, options?: any) {
  const sources = isArray(source) ? source : [source];
  const ilen = sources.length;

  if (!isObject(target)) {
    return target;
  }

  options = options || {};
  const merger = options.merger || mergerFn;

  for (let i = 0; i < ilen; ++i) {
    source = sources[i];
    if (!isObject(source)) {
      continue;
    }

    const keys = Object.keys(source);
    for (let k = 0, klen = keys.length; k < klen; ++k) {
      merger(keys[k], target, source, options);
    }
  }

  return target;
}

/**
 * Recursively deep copies `source` properties into `target` *only* if not defined in target.
 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
 * @param {object} target - The target object in which all sources are merged into.
 * @param {object|object[]} source - Object(s) to merge into `target`.
 * @returns {object} The `target` object.
 */
export function mergeIf(target: any, source: any) {
  return merge(target, source, { merger: mergerIfFn });
}

/**
 * Merges source[key] in target[key] only if target[key] is undefined.
 * @private
 */
export function mergerIfFn(key: string, target: any, source: any) {
  if (!isValidKey(key)) {
    return;
  }

  const tval = target[key];
  const sval = source[key];

  if (isObject(tval) && isObject(sval)) {
    mergeIf(tval, sval);
  } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = clone(sval);
  }
}

/**
 * 检查当前元素是否为Html元素
 * @param obj
 * @returns
 */
export function isElement(obj: any) {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return (
      typeof obj === 'object' &&
      obj.nodeType === 1 &&
      typeof obj.style === 'object' &&
      typeof obj.ownerDocument === 'object'
    );
  }
}

/**
 * Whether the text content is clipped due to CSS overflow, as in showing `...`.
 */
export function hasOverflowEllipsis(element: HTMLElement) {
  if (!element) {
    return false;
  }

  return element.offsetWidth < element.scrollWidth || element.offsetHeight < element.scrollHeight;
}

/**
 * Sets the `title` attribute in the event's element target, when the text
 * content is clipped due to CSS overflow, as in showing `...`.
 */
export function maybeShowTooltip(target: HTMLElement, title: string) {
  if (hasOverflowEllipsis(target)) {
    target.setAttribute('title', title);
  } else {
    target.removeAttribute('title');
  }
}

export const isFunction = (val: unknown): val is Function => typeof val === 'function';
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';
export const isPromise = <T = any>(val: any): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

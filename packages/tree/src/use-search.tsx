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

import { computed, toRef } from 'vue';

import { SearchOption, TreePropTypes } from './props';

export default (props: TreePropTypes) => {
  const refSearch = toRef(props, 'search');
  const { resultType = 'tree', showChildNodes = true } = (props.search ?? {}) as SearchOption;

  const isCommonType = (val: unknown) => ['string', 'number', 'boolean'].includes(typeof val);
  const exactMath = (matchValue: unknown, itemValue: unknown) => matchValue === itemValue;
  const regMatch = (matchValue: unknown, itemValue: unknown) => new RegExp(`${matchValue}`, 'i').test(`${itemValue}`);
  const matchFn = (match: (...args) => boolean, args: unknown[]) => Reflect.apply(match, this, args);
  const isSearchDisabled = refSearch.value === undefined || refSearch.value === false;

  const searchFn = (itemValue: unknown, item: unknown) => {
    if (isSearchDisabled) {
      return true;
    }

    if (isCommonType(refSearch.value)) {
      if (`${refSearch.value}`.length === 0) {
        return false;
      }

      return matchFn(regMatch, [refSearch.value, itemValue, item]);
    }

    const { value = '', match = 'fuzzy' } = refSearch.value as SearchOption;
    const defultMatch = match === 'fuzzy' ? regMatch : exactMath;
    const matchCallback = typeof match === 'function' ? match : defultMatch;
    if (`${value}`.length === 0) {
      return false;
    }

    return matchFn(matchCallback, [value, itemValue, item]);
  };

  const isSearchActive = computed(() => {
    if (refSearch.value === false) {
      return false;
    }

    if (isCommonType(refSearch.value)) {
      return `${refSearch.value}`.length > 0;
    }

    const { value = '' } = refSearch.value as SearchOption;
    return `${value}`.length > 0;
  });
  /**
   * 索索结果展示为Tree
   */
  const isTreeUI = computed(() => resultType === 'tree');

  return {
    searchFn,
    refSearch,
    isSearchActive,
    isSearchDisabled,
    resultType,
    isTreeUI,
    showChildNodes,
  };
};

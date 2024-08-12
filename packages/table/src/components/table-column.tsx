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
import { defineComponent, ExtractPropTypes, inject, onUnmounted, watch, toRaw } from 'vue';

import { PropTypes } from '@bkui-vue/shared';
import { isEqual } from 'lodash';

import { COL_MIN_WIDTH, PROVIDE_KEY_INIT_COL } from '../const';
import {
  columnType,
  fixedType,
  IFilterType,
  IOverflowTooltipPropType,
  ISortType,
  LabelFunctionStringType,
  RenderFunctionStringType,
  RowClassFunctionStringType,
  SpanFunctionStringType,
  StringNumberType,
  TableAlign,
} from '../props';

const TableColumnProp = {
  label: LabelFunctionStringType,
  field: LabelFunctionStringType,
  render: RenderFunctionStringType,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: StringNumberType(COL_MIN_WIDTH),
  columnKey: PropTypes.string.def(''),
  showOverflowTooltip: IOverflowTooltipPropType,
  type: columnType,
  resizable: PropTypes.bool.def(true),
  fixed: PropTypes.oneOfType([PropTypes.bool, fixedType]).def(false),
  sort: ISortType,
  filter: IFilterType,
  colspan: SpanFunctionStringType.def(1),
  rowspan: SpanFunctionStringType.def(1),
  align: TableAlign,
  className: RowClassFunctionStringType,
  prop: LabelFunctionStringType,
  index: PropTypes.number.def(undefined),
};

export type ITableColumn = Partial<ExtractPropTypes<typeof TableColumnProp>>;

export default defineComponent({
  name: 'TableColumn',
  props: TableColumnProp,
  setup(props: ITableColumn, {}) {
    const initTableColumns = inject(PROVIDE_KEY_INIT_COL, () => {});
    const lastPropsVal = {};

    watch(
      () => [props],
      () => {
        if (!isEqual(lastPropsVal, toRaw(props))) {
          initTableColumns();
          Object.assign(lastPropsVal, toRaw(props));
        }
      },
      { immediate: true, deep: true },
    );

    onUnmounted(() => {
      initTableColumns();
    });

    return () => {};
  },
});

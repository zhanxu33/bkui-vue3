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

import { PropType } from 'vue';

import type {
  DatePickerPlacementType,
  DatePickerShortcutsType,
  DatePickerValueType,
  DisabledDateType,
  PickerTypeType,
} from './interface';
import type { ExtractPropTypes } from 'vue';

export const datePickerProps = {
  type: {
    type: String as PropType<PickerTypeType>,
    default: 'date',
    validator(value) {
      const validList: PickerTypeType[] = [
        'year',
        'yearrange',
        'month',
        'monthrange',
        'date',
        'daterange',
        'datetime',
        'datetimerange',
        'time',
        'timerange',
      ];
      if (validList.indexOf(value) < 0) {
        console.error(`type property is not valid: '${value}'`);
        return false;
      }
      return true;
    },
  },
  // 外部设置的 popover class name
  extPopoverCls: {
    type: String,
    default: '',
  },
  format: String,
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  open: {
    // type: [Boolean, null],
    type: Boolean as () => boolean | null,
    default: null,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  timePickerOptions: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  splitPanels: {
    type: Boolean,
    default: true,
  },
  startDate: Date,
  placeholder: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<DatePickerPlacementType>,
    default: 'bottom-start',
    validator: value => {
      const validList: DatePickerPlacementType[] = [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ];
      if (validList.indexOf(value) < 0) {
        console.error(`placement property is not valid: '${value}'`);
        return false;
      }
      return true;
    },
  },
  appendToBody: {
    type: Boolean,
    default: false,
  },
  shortcuts: {
    type: Array as PropType<DatePickerShortcutsType>,
    default: () => [],
  },
  shortcutClose: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [Date, String, Number, Array] as PropType<DatePickerValueType | null>,
  },
  value: {
    type: [Date, String, Number, Array] as PropType<DatePickerValueType | null>,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  // normal: 12px
  // medium: 14px
  // large: 16px
  fontSize: {
    type: String as PropType<'large' | 'medium' | 'normal'>,
    default: 'normal',
  },
  // 结束时间是否允许“至今”
  upToNow: {
    type: Boolean,
    default: false,
  },
  useShortcutText: {
    type: Boolean,
    default: false,
  },
  shortcutSelectedIndex: {
    type: Number,
    default: -1,
  },
  headerSlotCls: {
    type: String,
    default: '',
  },
  footerSlotCls: {
    type: String,
    default: '',
  },
  allowCrossDay: {
    type: Boolean,
    default: false,
  },
  behavior: {
    type: String as PropType<'normal' | 'simplicity'>,
    default: 'normal',
    validator(v) {
      return ['simplicity', 'normal'].indexOf(v) > -1;
    },
  },
  disabledDate: Function as PropType<DisabledDateType>,
  withValidate: {
    type: Boolean,
    default: true,
  },
} as const;

export type DatePickerProps = Readonly<ExtractPropTypes<typeof datePickerProps>>;

export const timePanelProps = {
  // 禁止选择的小时
  disabledHours: {
    type: Array,
    default: () => [],
  },
  // 禁止选择的分钟
  disabledMinutes: {
    type: Array,
    default: () => [],
  },
  // 禁止选择的秒
  disabledSeconds: {
    type: Array,
    default: () => [],
  },
  // 是否隐藏禁止选择的小时、分钟、秒
  hideDisabledOptions: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 261,
  },
  // 回车模式，为 true 即需要按回车才会把时间回填到文本框
  enterMode: {
    type: Boolean,
    default: true,
  },
} as const;

export type TimePanelProps = Readonly<ExtractPropTypes<typeof timePanelProps>>;

export const timePickerProps = {
  type: {
    type: String as PropType<PickerTypeType>,
    default: 'time',
    validator(value) {
      const validList: PickerTypeType[] = ['time', 'timerange'];
      if (validList.indexOf(value) < 0) {
        console.error(`type property is not valid: '${value}'`);
        return false;
      }
      return true;
    },
  },
  allowCrossDay: {
    type: Boolean,
    default: false,
  },
};

export type TimePickerProps = Readonly<ExtractPropTypes<typeof timePickerProps>>;

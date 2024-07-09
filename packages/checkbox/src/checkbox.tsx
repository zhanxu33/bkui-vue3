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

import { defineComponent } from 'vue';
import { func } from 'vue-types';

import { usePrefix } from '@bkui-vue/config-provider';
import { Loading } from '@bkui-vue/icon';
import { classes, PropTypes, SizeEnum } from '@bkui-vue/shared';

import { useCheckbox, useFocus } from './common';

import type { ExtractPropTypes } from 'vue';

export const checkboxProps = {
  modelValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  trueLabel: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(true),
  falseLabel: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
  disabled: PropTypes.bool.def(false),
  checked: PropTypes.bool.def(false),
  indeterminate: PropTypes.bool,
  beforeChange: func<(event: boolean | number | string) => Promise<boolean> | boolean>().def(() => true),
  size: PropTypes.size().def(SizeEnum.DEFAULT),
  immediateEmitChange: PropTypes.bool.def(true), // 默认设置checked是否触发change事件
};

export type CheckboxProps = Readonly<ExtractPropTypes<typeof checkboxProps>>;

export default defineComponent({
  name: 'Checkbox',
  props: checkboxProps,
  emits: {
    'update:modelValue': (value: any) => value !== undefined,
    change: (value: any, _event?: Event) => value !== undefined,
    click: (_event: MouseEvent) => true,
  },
  setup(props) {
    const [isFocus, { blur: handleBlur, focus: handleFocus }] = useFocus();

    const { inputRef, isChecked, isPrechecking, isDisabled, setChecked, handleChange } = useCheckbox();

    const { resolveClassName } = usePrefix();

    return {
      inputRef,
      isFocus,
      isChecked,
      isPrechecking,
      isDisabled,
      setChecked,
      handleBlur,
      handleFocus,
      handleChange,
      size: props.size,
      resolveClassName,
    };
  },
  render() {
    const checkboxClass = classes({
      [`${this.resolveClassName('checkbox')}`]: true,
      [`${this.resolveClassName('checkbox')}-${this.size}`]: true,
      'is-focused': this.isFocus,
      'is-checked': this.isChecked,
      'is-disabled': this.isDisabled,
      'is-indeterminated': this.indeterminate,
      'is-prechecking': this.isPrechecking,
    });

    const renderLabel = () => {
      if (!this.label && !this.$slots.default) {
        return null;
      }

      return (
        <span class={`${this.resolveClassName('checkbox-label')}`}>
          {this.$slots.default ? this.$slots.default() : this.label}
        </span>
      );
    };

    return (
      <label class={checkboxClass}>
        <span class={this.resolveClassName('checkbox-input')}>
          <input
            ref='inputRef'
            class={`${this.resolveClassName('checkbox-original')}`}
            checked={this.isChecked}
            disabled={this.isDisabled || this.isPrechecking}
            role='checkbox'
            type='checkbox'
            onChange={this.handleChange}
          />
        </span>
        {renderLabel()}
        {this.isPrechecking && <Loading class={`${this.resolveClassName('checkbox-checking')}`} />}
      </label>
    );
  },
});

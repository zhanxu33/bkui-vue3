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

import { computed, defineComponent, SlotsType } from 'vue';
import { toType } from 'vue-types';

import { usePrefix } from '@bkui-vue/config-provider';
import { Error } from '@bkui-vue/icon';
import { PropTypes, TagThemeType } from '@bkui-vue/shared';

enum TagStrokeType {
  FILLED = 'filled',
  STROKE = 'stroke',
  UNKNOWN = '',
}

export default defineComponent({
  name: 'Tag',
  props: {
    theme: TagThemeType().def(''),
    closable: PropTypes.bool.def(false),
    type: toType<`${TagStrokeType}`>('tagStorkeType', {}).def(TagStrokeType.UNKNOWN),
    checkable: PropTypes.bool.def(false),
    checked: PropTypes.bool.def(false),
    radius: PropTypes.string.def('2px'),
    size: PropTypes.size(),
  },
  emits: ['change', 'close'],
  slots: Object as SlotsType<{
    default?: () => HTMLElement;
    icon?: () => HTMLElement;
  }>,
  setup(props, { emit }) {
    const { resolveClassName } = usePrefix();

    const wrapperStyle = computed(() => ({
      borderRadius: props.radius,
    }));

    const handleClose = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      emit('close', e);
    };

    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      if (props.checkable) {
        emit('change', !props.checked);
      }
    };

    return {
      wrapperStyle,
      handleClose,
      handleClick,
      resolveClassName,
    };
  },
  render() {
    const classes = {
      [this.resolveClassName('tag')]: true,
      [this.resolveClassName('tag-closable')]: this.closable,
      [this.resolveClassName('tag-checkable')]: this.checkable,
      [this.resolveClassName('tag-check')]: this.checked,
      [this.resolveClassName(`tag-${this.type}`)]: this.type,
      [this.resolveClassName(`tag-${this.theme}`)]: this.theme,
      [this.resolveClassName(`tag--${this.size}`)]: true,
    };

    return (
      <div
        style={this.wrapperStyle}
        class={classes}
        onClick={this.handleClick}
      >
        {this.$slots.icon ? <span class={`${this.resolveClassName('tag-icon')}`}>{this.$slots.icon()}</span> : ''}
        <span class={`${this.resolveClassName('tag-text')}`}>{this.$slots.default?.()}</span>
        {this.closable && (
          <Error
            class={`${this.resolveClassName('tag-close')}`}
            onClick={this.handleClose}
          />
        )}
      </div>
    );
  },
});

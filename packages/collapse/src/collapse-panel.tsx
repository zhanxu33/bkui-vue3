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
import { defineComponent, h, inject, Ref, ref, watch } from 'vue';

import CollapseTransition from '@bkui-vue/collapse-transition';
import { usePrefix } from '@bkui-vue/config-provider';
import * as BkIcon from '@bkui-vue/icon';

import { propsCollapsePanel as props } from './props';

export default defineComponent({
  name: 'CollapsePanel',
  props,
  emits: ['change', 'update:modelValue', 'after-leave', 'before-enter'],
  setup(props, { emit, slots }) {
    let localActiveItems = null;
    let handleItemClick = null;
    const isActive = ref(props.modelValue);
    watch(
      () => props.modelValue,
      newVal => {
        isActive.value = newVal;
      },
    );
    // 如果单独使用，避免报 injection "*" not found. 相比getCurrentInstance()?.parent.type.name 方法简洁
    if (!props.alone) {
      localActiveItems = inject<Ref<(number | string)[]>>('localActiveItems');
      handleItemClick = inject<(value: Partial<{ name: string }>) => void>('handleItemClick');
      watch(
        localActiveItems,
        newVal => {
          if (newVal?.length) {
            isActive.value = newVal.includes(props.name);
          }
        },
        {
          immediate: true,
        },
      );
    }

    const { resolveClassName } = usePrefix();

    function toCamelCase(str) {
      const words = str.split('-');
      const camelCaseWords = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1));
      return camelCaseWords.join('');
    }

    function clickItem() {
      const { disabled, name, itemClick } = props;
      if (disabled) return;
      const data = { name };

      isActive.value = !isActive.value;

      emit('update:modelValue', isActive.value);
      emit('change', data);
      if (typeof itemClick === 'function') {
        itemClick(data);
      } else if (typeof handleItemClick === 'function') {
        handleItemClick({ name });
      }
    }

    function getContent() {
      if (slots.content) {
        return slots.content(h);
      }
      return props.content;
    }

    function renderPanel() {
      if (props.renderDirective === 'if' && !isActive.value) {
        return '';
      }
      return (
        <div
          class={`${resolveClassName('collapse-content')} ${(isActive.value && 'active') || ''}`}
          v-show={isActive.value}
        >
          {getContent()}
        </div>
      );
    }

    function renderHeader(icon: any) {
      if (slots.header) {
        if (typeof slots.header === 'function') {
          return slots.header(h);
        }
        return slots.header;
      }
      let title;
      if (slots.default) {
        if (typeof slots.default === 'function') {
          title = slots.default(h);
        } else {
          title = slots.default;
        }
      } else {
        title = props.title;
      }

      return (
        <>
          <div class={`${resolveClassName('collapse-header')}`}>
            <span class={`${resolveClassName('collapse-title')}`}>{title}</span>
            {icon}
          </div>
        </>
      );
    }

    return {
      isActive,
      collapseIcon: BkIcon[`${toCamelCase(props.icon)}`],
      clickItem,
      renderPanel,
      renderHeader,
      resolveClassName,
    };
  },
  render() {
    return (
      <div
        class={`${this.resolveClassName('collapse-item')} ${this.disabled ? 'is-disabled' : ''} ${
          this.isActive ? `${this.resolveClassName('collapse-item-active')}` : ''
        }`}
      >
        <div onClick={() => this.clickItem()}>
          {this.renderHeader(
            <this.collapseIcon
              class={`${this.resolveClassName('collapse-icon')} ${(this.isActive && 'rotate-icon') || ''}`}
            />,
          )}
        </div>
        <CollapseTransition>{this.renderPanel()}</CollapseTransition>
      </div>
    );
  },
});

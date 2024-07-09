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

import { defineComponent, reactive } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { CloseLine, InfoLine } from '@bkui-vue/icon';
import { classes, PropTypes, TagThemeEnum, TagThemeType } from '@bkui-vue/shared';

export default defineComponent({
  name: 'Alert',
  props: {
    theme: TagThemeType().def(TagThemeEnum.INFO),
    title: PropTypes.string,
    closable: PropTypes.bool.def(false),
    closeText: PropTypes.string,
    showIcon: PropTypes.bool.def(true),
  },
  emits: {
    close: (event: Event) => event,
  },
  setup(_props, context) {
    const state = reactive({
      visible: true,
    });

    const handleClose = (event: Event) => {
      state.visible = false;
      context.emit('close', event);
    };

    return {
      state,
      handleClose,
    };
  },
  render() {
    if (!this.state.visible) {
      return null;
    }

    const { resolveClassName } = usePrefix();

    const renderCloseText = Boolean(this.closeText);
    const closeButtonClasses: string = classes({
      [resolveClassName('alert-close')]: true,
      'close-text': renderCloseText,
      [resolveClassName('alert-close-icon')]: !renderCloseText,
    });

    const typeClass: string = classes({
      [resolveClassName('alert')]: true,
      [resolveClassName(`alert-${this.theme}`)]: true,
    });

    return (
      <div class={typeClass}>
        <div class={resolveClassName('alert-wraper')}>
          {this.showIcon && <InfoLine class={resolveClassName('alert-icon-info')} />}
          <div class={resolveClassName('alert-content')}>
            <div class={resolveClassName('alert-title')}>{this.$slots.title ? this.$slots.title() : this.title}</div>
            <div class={resolveClassName('alert-description')}>{this.$slots.default?.()}</div>
          </div>
          {this.closable && (
            <span
              class={closeButtonClasses}
              onClick={this.handleClose}
            >
              {this.closeText ? this.closeText : <CloseLine />}
            </span>
          )}
        </div>
      </div>
    );
  },
});

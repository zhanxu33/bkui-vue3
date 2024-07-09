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

import { computed, defineComponent, inject, provide } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import { containerKey } from './interface';

export default defineComponent({
  name: 'Row',
  emits: [],
  setup(_props, ctx) {
    const { col, gutter, flex } = inject(containerKey);
    provide('containerProps', {
      col,
      gutter,
      flex,
    });

    const { resolveClassName } = usePrefix();

    const style: any = computed(() => {
      const o = flex ? { display: ['-webkit-box', '-ms-flexbox', 'flex'] } : {};
      return { ...o, 'margin-right': `-${gutter / 2}px`, 'margin-left': `-${gutter / 2}px` };
    });
    return () => (
      <div
        style={style.value}
        class={`${resolveClassName('grid-row')}`}
      >
        {ctx.slots.default?.()}
      </div>
    );
  },
});

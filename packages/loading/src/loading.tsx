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

import { computed, defineComponent, ExtractPropTypes, PropType, VNode } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, PropTypes } from '@bkui-vue/shared';

export enum BkLoadingMode {
  Default = 'default',
  Spin = 'spin',
}

export enum BkLoadingSize {
  Large = 'large',
  Mini = 'mini',
  Normal = '',
  Small = 'small',
}

let defaultIndicator: () => VNode;
export function setDefaultIndicator(Indicator: any) {
  defaultIndicator = typeof Indicator === 'function' ? Indicator : () => <Indicator />;
}

export const loadingTypes = {
  indicator: {
    type: Function,
  },
  loading: PropTypes.bool.def(true),
  inline: PropTypes.bool.def(true),
  theme: {
    type: String as PropType<'danger' | 'default' | 'primary' | 'success' | 'warning' | 'white'>,
  },
  title: PropTypes.string.def(''),
  size: {
    type: String as PropType<`${BkLoadingSize}`>,
    default: BkLoadingSize.Normal,
  },
  mode: {
    type: String as PropType<`${BkLoadingMode}`>,
    default: 'default',
  },
  opacity: PropTypes.number.def(0.9),
  color: PropTypes.string.def('white'),
  zIndex: PropTypes.number.def(1),
  isDirective: PropTypes.bool.def(false),
};

export type LoadingTypes = ExtractPropTypes<typeof loadingTypes>;

export default defineComponent({
  name: 'Loading',
  props: loadingTypes,
  setup(props: LoadingTypes, ctx) {
    const { resolveClassName } = usePrefix();
    const dotIndicator = (
      <div class={`${resolveClassName('normal-indicator')}`}>
        {[1, 2, 3, 4].map(i => (
          <span class={`dot dot-${i}`}></span>
        ))}
      </div>
    );
    const spinIndicator = (
      <div class={`${resolveClassName('spin-indicator')}`}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <span class={`oval oval-${i}`}></span>
        ))}
      </div>
    );

    const zIndexStyle = computed(() => ({
      zIndex: props.zIndex,
    }));
    const maskStyle = computed(() => ({
      opacity: props.opacity,
      backgroundColor: props.color,
      ...zIndexStyle.value,
    }));

    const loadingWrapperCls = computed(() =>
      classes({
        [`${resolveClassName('loading-wrapper')}`]: props.loading,
        [`${resolveClassName('nested-loading')}`]: !!ctx.slots.default,
        [`${resolveClassName('directive-loading')}`]: props.isDirective,
      }),
    );
    const containerCls = computed(() =>
      classes(
        {
          [`${resolveClassName(`loading-size-${props.size}`)}`]: !!props.size,
          [`${resolveClassName(`loading-${props.theme}`)}`]: !!props.theme,
        },
        resolveClassName('loading-indicator'),
      ),
    );
    const hasTitle = computed(() => !!props.title);

    const indicator = computed(() => {
      const isSpinMode = props.mode === BkLoadingMode.Spin;
      if (typeof props.indicator === 'function') {
        return <props.indicator />;
      }
      if (typeof defaultIndicator === 'function') {
        return <defaultIndicator />;
      }
      return isSpinMode ? spinIndicator : dotIndicator;
    });

    return () => (
      <div class={loadingWrapperCls.value}>
        {ctx.slots.default?.()}
        {props.loading && [
          (ctx.slots.default || props.isDirective) && (
            <div
              style={maskStyle.value}
              class={`${resolveClassName('loading-mask')}`}
            ></div>
          ),
          <div
            style={zIndexStyle.value}
            class={containerCls.value}
          >
            {indicator.value}
            {hasTitle.value && <div class={`${resolveClassName('loading-title')}`}>{props.title}</div>}
          </div>,
        ]}
      </div>
    );
  },
});

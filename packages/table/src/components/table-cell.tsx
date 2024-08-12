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
import { computed, CSSProperties, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { toType } from 'vue-types';

import { bkEllipsisInstance } from '@bkui-vue/directives';
import { hasOverflowEllipsis, isElement, PropTypes } from '@bkui-vue/shared';

import { Column, IColumnType, IOverflowTooltipOption, IOverflowTooltipPropType, ResizerWay } from '../props';
import { observerResize, resolveNumberOrStringToPix, resolvePropVal } from '../utils';
// import
export default defineComponent({
  name: 'TableCell',
  props: {
    column: IColumnType,
    row: PropTypes.any.def({}),
    parentSetting: IOverflowTooltipPropType,
    title: PropTypes.string.def(undefined),
    observerResize: PropTypes.bool.def(true),
    intersectionObserver: PropTypes.bool.def(false),
    isHead: PropTypes.bool.def(false),
    isExpandChild: PropTypes.bool.def(false),
    headExplain: PropTypes.string,
    resizerWay: toType<`${ResizerWay}`>('ResizerWay', {
      default: ResizerWay.DEBOUNCE,
    }),
  },

  setup(props, { slots }) {
    const refRoot = ref();
    const isTipsEnabled = ref(false);
    const renderSlots = ref(!props.intersectionObserver);

    const cellStyle = computed(() => ({
      textAlign: props.column.textAlign as CSSProperties['textAlign'],
      minWidth: resolveNumberOrStringToPix(props.column.minWidth, null),
    }));

    const resolveSetting = () => {
      if (/boolean|object/.test(typeof props.column.showOverflowTooltip) && props.column.showOverflowTooltip !== null) {
        const {
          content = '',
          mode = undefined,
          popoverOption = {},
        } = props.column.showOverflowTooltip as IOverflowTooltipOption;
        const result = {
          showOverflowTooltip: {
            content,
            disabled: !props.column.showOverflowTooltip,
            mode,
            resizerWay: undefined,
            watchCellResize: undefined,
            popoverOption,
            allowHtml: false,
          },
        };
        if (props.parentSetting !== null && typeof props.parentSetting === 'object') {
          Object.assign(result.showOverflowTooltip, props.parentSetting, {
            disabled: !props.column.showOverflowTooltip,
          });

          if (typeof props.column.showOverflowTooltip === 'object') {
            Object.assign(result.showOverflowTooltip, props.column.showOverflowTooltip);
          }
        }

        return result;
      }

      return { showOverflowTooltip: props.parentSetting };
    };

    let bkEllipsisIns = null;

    const getContentValue = (allowHtml = false) => {
      const target: HTMLElement = getEllipsisTarget();
      if (allowHtml) {
        return target?.cloneNode?.(true) ?? '';
      }

      return target?.innerText ?? '';
    };

    const resolveTooltipOption = () => {
      const { showOverflowTooltip = false } = resolveSetting();

      let disabled: ((col: Column, row: Record<string, object>) => boolean) | boolean = true;
      let { resizerWay } = props;
      const defaultContent = getContentValue((showOverflowTooltip as IOverflowTooltipOption).allowHtml);
      let content: () => ((col: Column, row: Record<string, object>) => string) | Node | string = () => defaultContent;
      let popoverOption = {};
      let mode = 'auto';
      let watchCellResize = true;
      if (typeof showOverflowTooltip === 'boolean') {
        disabled = !showOverflowTooltip;
      }

      if (typeof showOverflowTooltip === 'object') {
        disabled = showOverflowTooltip.disabled;
        popoverOption = showOverflowTooltip.popoverOption;
        resizerWay = showOverflowTooltip.resizerWay || 'debounce';
        content = () => showOverflowTooltip.content || defaultContent;
        if (typeof showOverflowTooltip.content === 'function') {
          content = () => (showOverflowTooltip.content as (col, row) => string)(props.column, props.row);
        }

        watchCellResize = showOverflowTooltip.watchCellResize;
        mode = showOverflowTooltip.mode || 'auto';
      }

      if (typeof disabled === 'function') {
        disabled = Reflect.apply(disabled, this, [props.column, props.row]);
      }

      /**
       * 当表格中的字段或数据需要做解释说明时，可增加 [下划线] 提示，hover 可查看解释说明的 tooltips
       */
      if (props.column.explain) {
        disabled = false;
        mode = 'static';

        if (typeof props.column.explain === 'object') {
          content = () =>
            resolvePropVal(props.column.explain as Record<string, unknown>, 'content', [props.column, props.row]);
        }
      }

      if (props.isHead) {
        disabled = !((props.column?.showOverflowTooltip as IOverflowTooltipOption)?.showHead ?? true);
        mode = 'auto';
        content = () => getEllipsisTarget()?.cloneNode?.(true) ?? '';

        if (props.headExplain) {
          mode = 'static';
          content = () => props.headExplain;
        }
      }

      if (props.column.type === 'expand' && !props.isHead && !props.isExpandChild) {
        disabled = true;
      }

      return { disabled, content, mode, resizerWay, watchCellResize, popoverOption };
    };

    const getEllipsisTarget = () => {
      if (props.isHead) {
        return refRoot.value?.querySelector?.('.head-text');
      }

      return refRoot.value;
    };

    const resolveOverflowTooltip = () => {
      const target = getEllipsisTarget();
      if (!target || !isElement(target)) {
        return;
      }

      const { mode, disabled } = resolveTooltipOption();
      isTipsEnabled.value = !disabled;

      if (mode === 'auto') {
        isTipsEnabled.value = hasOverflowEllipsis(target);
      }

      if (mode === 'static') {
        isTipsEnabled.value = true;
      }

      if (isTipsEnabled.value) {
        const bindings = ref(resolveTooltipOption());
        if (bkEllipsisIns === null) {
          bkEllipsisIns = bkEllipsisInstance(target, {
            disabled: bindings.value.disabled,
            content: bindings.value.content,
            mode: bindings.value.mode,
            popoverOption: bindings.value.popoverOption,
          });
        }
      } else {
        bkEllipsisIns?.destroyInstance(target);
        bkEllipsisIns = null;
      }
    };

    let resizeObserverIns = null;
    const onComponentRender = () => {
      const { disabled, resizerWay, watchCellResize } = resolveTooltipOption();
      if (!disabled) {
        resolveOverflowTooltip();
        if (watchCellResize !== false && props.observerResize) {
          resizeObserverIns = observerResize(
            refRoot.value,
            () => {
              resolveOverflowTooltip();
            },
            60,
            true,
            resizerWay,
          );
          resizeObserverIns.start();
        }
      }
    };

    let intersectionObserver = null;
    const initObserver = () => {
      if (!props.intersectionObserver) {
        return;
      }

      intersectionObserver = new IntersectionObserver(
        entries => {
          if (entries[0].intersectionRatio <= 0) {
            renderSlots.value = false;
            bkEllipsisIns?.destroyInstance(refRoot.value);
            return;
          }

          renderSlots.value = true;
          onComponentRender();
        },
        {
          threshold: 0.5,
        },
      );

      intersectionObserver?.observe(refRoot.value);
    };

    onMounted(() => {
      initObserver();

      if (!renderSlots.value) {
        return;
      }

      onComponentRender();
    });

    onBeforeUnmount(() => {
      resizeObserverIns?.disconnect();
      resizeObserverIns = null;
      bkEllipsisIns?.destroyInstance(refRoot.value);
      intersectionObserver?.disconnect();
      intersectionObserver = null;
    });

    const hasExplain = props.headExplain || props.column.explain;
    return () => (
      <div
        ref={refRoot}
        style={cellStyle.value}
        class={['cell', props.column.type, hasExplain ? 'explain' : '']}
      >
        {renderSlots.value ? slots.default?.() : '--'}
      </div>
    );
  },
});

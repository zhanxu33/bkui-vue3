/**
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

import { defineComponent, ExtractPropTypes, onMounted, ref, watch } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { Circle, Done, Error } from '@bkui-vue/icon';
import { classes, PropTypes } from '@bkui-vue/shared';
// import { Error, Circle, Done } from '@bkui-vue/icon';

const processProps = {
  list: PropTypes.array.def([]),
  controllable: PropTypes.bool.def(false),
  showSteps: PropTypes.bool.def(false),
  curProcess: PropTypes.number.def(0),
  displayKey: PropTypes.string.def('content'),
  extCls: PropTypes.string,
};

export type ProcessPropType = ExtractPropTypes<typeof processProps>;

export default defineComponent({
  name: 'Process',
  props: processProps,
  emits: ['update:curProcess', 'click'],

  setup(props: ProcessPropType, { emit }) {
    const t = useLocale('process');
    const lang = useLocale('lang');
    const defaultProcessList = ref([]);
    const paddingBottom = ref(0);

    const init = () => {
      defaultProcessList.value.splice(
        0,
        defaultProcessList.value.length,
        ...[
          {
            content: t.value.step1,
          },
          {
            content: t.value.step2,
          },
          {
            content: t.value.step3,
          },
          {
            content: t.value.step4,
          },
        ],
      );
      if (props.list?.length) {
        defaultProcessList.value.splice(0, defaultProcessList.value.length, ...props.list);
      }
    };

    watch(
      () => lang.value,
      () => {
        init();
      },
    );

    const jumpTo = async index => {
      try {
        if (props.controllable && index !== props.curProcess) {
          emit('update:curProcess', index);
          emit('click', index);
        }
      } catch (e) {
        console.warn(e);
      }
    };

    onMounted(init);

    const { resolveClassName } = usePrefix();

    return {
      defaultProcessList,
      paddingBottom,
      jumpTo,
      resolveClassName,
    };
  },

  render() {
    const processClsPrefix = this.resolveClassName('process');
    const processCls: string = classes(
      {
        [`${this.extCls}`]: !!this.extCls,
      },
      `${processClsPrefix}`,
    );

    const isLoadingStatus = item => item.status === 'loading';

    const isErrorStatus = item => item.status === 'error';

    const isDone = index => this.curProcess >= index + 1 || this.defaultProcessList[index].status === 'done';

    const isIcon = item => (item.icon ? item.icon : '');

    const renderIcon = (index, item) => {
      if (index === this.curProcess - 1 && isLoadingStatus(item)) {
        return (
          <Circle class={`${this.resolveClassName('icon')} ${this.resolveClassName('process-icon')} icon-loading`} />
        );
      }
      if (index === this.curProcess - 1 && isErrorStatus(item)) {
        return <Error class={`${this.resolveClassName('process-icon')} icon-error`} />;
      }
      if (index === this.curProcess - 1 && isIcon(item)) {
        return <span class={`${this.resolveClassName('process-icon-custom')}`}>{<item.icon />}</span>;
      }
      if (isDone(index)) {
        return <Done class={`${this.resolveClassName('process-icon-done')}`} />;
      }
      // return (<span class="number">{<item.icon/>}</span>);
    };

    return (
      <div class={processCls}>
        <ul style={{ paddingBottom: `${this.paddingBottom}px` }}>
          {this.defaultProcessList.map((item, index) => (
            <li
              style={{ cursor: this.controllable ? 'pointer' : '' }}
              class={{
                success: this.curProcess >= index + 1,
                current: isLoadingStatus(item) && index === this.curProcess - 1,
                error: isErrorStatus(item) && index === this.curProcess - 1,
              }}
              onClick={() => {
                this.jumpTo(index + 1);
              }}
            >
              <div>
                <span class='display'>{item[this.displayKey]}</span>
                {renderIcon(index, item)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});

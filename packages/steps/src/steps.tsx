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
import { toType } from 'vue-types';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { Circle, Done, Error } from '@bkui-vue/icon';
import { classes, directionType, lineStyleType, PropTypes, ThemeEnum } from '@bkui-vue/shared';

enum StatusEnum {
  ERROR = 'error',
  LOADING = 'loading',
  UNKNOWN = '',
}
const stepsProps = {
  theme: PropTypes.theme().def(ThemeEnum.PRIMARY),
  size: PropTypes.size(),
  curStep: PropTypes.number.def(1),
  controllable: PropTypes.bool.def(false),
  direction: directionType(),
  status: toType<`${StatusEnum}`>('status', {}).def(StatusEnum.UNKNOWN),
  lineType: lineStyleType(),
  extCls: PropTypes.string,
  steps: PropTypes.array.def([]),
  beforeChange: PropTypes.func,
};

export type StepsPropTypes = ExtractPropTypes<typeof stepsProps>;

export default defineComponent({
  name: 'Steps',
  props: stepsProps,
  emits: ['update:curStep', 'click'],

  setup(props: StepsPropTypes, { emit }) {
    const t = useLocale('steps');
    const lang = useLocale('lang');

    const defaultSteps = ref([]);

    const updateSteps = steps => {
      const defaults = [];
      steps.forEach(step => {
        if (typeof step === 'string') {
          defaults.push(step);
        } else {
          defaults.push({
            title: step.title,
            icon: step.icon,
            description: step.description,
            status: step.status,
            border: step.border ?? true,
          });
        }
      });
      defaultSteps.value.splice(0, defaultSteps.value.length, ...defaults);
    };

    const updateCurStep = curStep => {
      stepsProps.curStep = curStep;
    };

    const init = () => {
      defaultSteps.value.splice(
        0,
        defaultSteps.value.length,
        ...[
          {
            title: t.value.step1,
            icon: 1,
          },
          {
            title: t.value.step2,
            icon: 2,
          },
          {
            title: t.value.step3,
            icon: 3,
          },
        ],
      );
      if (props.steps?.length) {
        updateSteps(props.steps);
      }
    };

    watch(
      () => lang.value,
      () => {
        init();
      },
    );

    // const globalConfigData = inject(rootProviderKey);
    // watch(() => globalConfigData, () => {
    //   init();
    // }, { deep: true });

    const jumpTo = async index => {
      try {
        if (props.controllable && index !== props.curStep) {
          if (typeof props.beforeChange === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await new Promise(async (resolve, reject) => {
              const confirmed = await props.beforeChange(index);
              confirmed ? resolve(confirmed) : reject(confirmed);
            });
          }
          emit('update:curStep', index);
          emit('click', index);
        }
      } catch (e) {
        console.warn(e);
      }
    };

    onMounted(init);

    watch(
      () => props.steps,
      () => {
        updateSteps(props.steps);
      },
      { deep: true },
    );

    watch(
      () => props.curStep,
      () => {
        updateCurStep(props.curStep);
      },
      { deep: true },
    );

    const { resolveClassName } = usePrefix();

    return {
      defaultSteps,
      jumpTo,
      resolveClassName,
    };
  },

  render() {
    const stepsClsPrefix = this.resolveClassName('steps');
    const stepsThemeCls: string = this.theme ? `${stepsClsPrefix}-${this.theme}` : '';
    const stepsSizeCls: string = this.size ? `${stepsClsPrefix}-${this.size}` : '';
    const stepsCls: string = classes(
      {
        [`${this.extCls}`]: !!this.extCls,
        [`${this.resolveClassName(`steps-${this.direction}`)}`]: this.direction,
        [`${this.resolveClassName(`steps-${this.lineType}`)}`]: this.lineType,
      },
      `${stepsThemeCls} ${stepsClsPrefix} ${stepsSizeCls}`,
    );

    const isDone = index => this.curStep > index + 1 || this.defaultSteps[index].status === 'done';

    const isCurrent = index => this.curStep === index + 1;

    const iconType = step => {
      const { icon } = step;

      if (icon) {
        return Object.prototype.toString.call(icon) === '[object Object]';
      }
      return typeof step === 'string';
    };

    // const isIcon = (index, step) => (step.icon ? step.icon : index + 1);
    const isNumberIcon = (index, step) => {
      if (!step.icon) {
        step.icon = index;
      }
      return !isNaN(step.icon);
    };

    const isLoadingStatus = step => step.status === 'loading';

    const isErrorStatus = step => step.status === 'error';

    const renderIcon = (index, step) => {
      if ((isCurrent(index) && this.status === 'loading') || isLoadingStatus(step)) {
        return (
          <Circle class={`${this.resolveClassName('icon')} ${this.resolveClassName('steps-icon')} icon-loading`} />
        );
      }
      if ((isCurrent(index) && this.status === 'error') || isErrorStatus(step)) {
        return <Error class={`${this.resolveClassName('steps-icon')}`} />;
      }
      if (isDone(index)) {
        return <Done class={`${this.resolveClassName('steps-icon')}`} />;
      }
      return <span>{isNumberIcon(index, step) ? index + 1 : <step.icon />}</span>;
    };

    return (
      <div class={stepsCls}>
        {this.defaultSteps.map((step, index) => (
          <div
            class={[
              this.resolveClassName('step'),
              !step.title ? this.resolveClassName('step-no-content') : '',
              isDone(index) ? 'done' : '',
              isCurrent(index) ? 'current' : '',
              isCurrent(index) && this.status === 'error' ? 'is-error' : '',
              step.status && isCurrent(index) ? [`${this.resolveClassName(`step-${step.status}`)}`] : '',
            ]}
          >
            <span
              style={{ cursor: this.controllable ? 'pointer' : '' }}
              class={[
                `${this.resolveClassName('step-indicator')}`,
                `${this.resolveClassName(`step-${iconType(step) ? 'icon' : 'number'}`)}`,
                `${this.resolveClassName(`step-icon${step.status}`)}`,
              ]}
              onClick={() => {
                this.jumpTo(index + 1);
              }}
            >
              {this.$slots[index + 1]?.() ?? renderIcon(index, step)}
            </span>
            {step.title ? (
              <div class={`${this.resolveClassName('step-content')}`}>
                <div
                  style={{ cursor: this.controllable ? 'pointer' : '' }}
                  class={`${this.resolveClassName('step-title')}`}
                  onClick={() => {
                    this.jumpTo(index + 1);
                  }}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div
                    class={`${this.resolveClassName('step-description')}`}
                    title={step.description}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
    );
  },
});

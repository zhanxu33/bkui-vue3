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

import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  SlotsType,
  Teleport,
  toRefs,
  Transition,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { clickoutside } from '@bkui-vue/directives';
import { Close } from '@bkui-vue/icon';
import { getFullscreenRoot, useFormItem } from '@bkui-vue/shared';

import PickerDropdown from './base/picker-dropdown';
import { dateIcon, timeIcon } from './common';
// import VueTypes, { toType, toValidableType } from 'vue-types';
import TimePanel from './panel/time';
import TimeRangePanel from './panel/time-range';
import { datePickerProps, timePanelProps, timePickerProps } from './props';
import { extractTime, formatDate, isAllEmptyArr, parseDate, timePickerKey } from './utils';

// import { PropTypes } from '@bkui-vue/shared';
import type { DatePickerPanelType, SelectionModeType } from './interface';

export default defineComponent({
  name: 'TimePicker',
  directives: {
    clickoutside,
  },
  props: {
    ...datePickerProps,
    ...timePickerProps,
    ...timePanelProps,
  },
  emits: ['open-change', 'input', 'change', 'update:modelValue', 'clear', 'shortcut-change', 'pick-success'],
  // slots: ['header'],
  slots: Object as SlotsType<{
    header?: () => any;
    trigger?: (displayValue: string) => any;
    footer?: () => any;
    shortcuts?: (arg?: { change: Function }) => any;
    confirm?: {};
  }>,
  setup(props, { slots, emit }) {
    const { resolveClassName } = usePrefix();
    const teleportTo = ref(getFullscreenRoot());
    const formItem = useFormItem();
    const isRange = props.type.includes('range');
    const emptyArray = isRange ? [null, null] : [null];
    let initialValue = isAllEmptyArr((isRange ? (props.modelValue as any[]) : [props.modelValue]) || [])
      ? emptyArray
      : parseDate(props.modelValue, props.type, props.multiple, props.format);

    let shortcut = null;
    if (props.shortcutSelectedIndex !== -1) {
      shortcut = props.shortcuts[props.shortcutSelectedIndex] || null;
      if (shortcut) {
        initialValue = shortcut.value();
      }
    }

    const state = reactive({
      showClose: false,
      visible: false,
      internalValue: initialValue,
      disableClickOutSide: false,
      disableCloseUnderTransfer: false,
      selectionMode: 'date' as SelectionModeType,
      forceInputRerender: 1,
      isFocused: false,
      focusedDate: initialValue[0] || props.startDate || new Date(),
      focusedTime: {
        column: 0,
        picker: 0,
        time: initialValue.map(extractTime),
        active: false,
      },
      internalFocus: false,
      timeEnterMode: true,
      shortcut,
      onSelectionModeChange,

      // for 编辑时，mouseleave 事件中缓存的 value
      tmpValue: initialValue,
    });

    function onSelectionModeChange(_type) {
      let type = _type;
      if (_type.match(/^date/)) {
        type = 'date';
      }
      // return ['year', 'month', 'date', 'time'].indexOf(type) > -1 && type;
      state.selectionMode = ['year', 'month', 'date', 'time'].indexOf(type) > -1 && type;
      return state.selectionMode;
    }

    const publicVModelValue = computed(() => {
      if (props.multiple) {
        return state.internalValue.slice();
      }
      const isRange = props.type.includes('range');
      let val = state.internalValue.map(date => (date instanceof Date ? new Date(date) : date || ''));

      if (props.type.match(/^time/)) {
        val = val.map(v => formatDate(v, props.type, props.multiple, props.format));
      }
      return isRange || props.multiple ? val : val[0];
    });

    const publicStringValue = computed(() => {
      if (props.type.match(/^time/)) {
        return publicVModelValue.value;
      }
      if (props.multiple) {
        return formatDate(publicVModelValue.value, props.type, props.multiple, props.format);
      }
      return Array.isArray(publicVModelValue.value)
        ? publicVModelValue.value.map(v => formatDate(v, props.type, props.multiple, props.format))
        : formatDate(publicVModelValue.value, props.type, props.multiple, props.format);
    });

    const panel = computed<DatePickerPanelType>(() => {
      const isRange = props.type === 'timerange';
      return isRange ? 'RangeTimePickerPanel' : 'TimePickerPanel';
    });

    const opened = computed(() => (props.open === null ? state.visible : props.open));

    const visualValue = computed(() => formatDate(state.internalValue, props.type, props.multiple, props.format));

    const displayValue = computed(() => {
      // 展示快捷文案
      if (state.shortcut?.text && props.useShortcutText) {
        return state.shortcut.text;
      }
      return visualValue.value;
    });

    const isConfirm = computed(
      () => !!slots.trigger || props.type === 'datetime' || props.type === 'datetimerange' || props.multiple,
    );

    const hasHeader = computed(() => !!slots.header);
    const hasFooter = computed(() => !!slots.footer);
    const hasShortcuts = computed(() => !!slots.shortcuts);

    const fontSizeCls = computed(() => {
      let cls = '';
      if (props.fontSize === 'medium') {
        cls = 'medium-font';
      } else if (props.fontSize === 'large') {
        cls = 'large-font';
      }
      return cls;
    });

    const longWidthCls = computed(() => {
      let cls = '';
      if (props.fontSize === 'medium') {
        cls = 'medium-width';
      } else if (props.fontSize === 'large') {
        cls = 'large-width';
      }
      return cls;
    });

    const localReadonly = computed(() => {
      // 如果当前使用快捷选择，且配置展示快捷文案，则输入框不允许编辑
      if (state.shortcut?.text && props.useShortcutText) {
        return true;
      }
      return !props.editable || props.readonly;
    });

    const ownPickerProps = computed(() => ({
      disabledHours: props.disabledHours,
      disabledMinutes: props.disabledMinutes,
      disabledSeconds: props.disabledSeconds,
      hideDisabledOptions: props.hideDisabledOptions,
    }));

    // 限制 allow-cross-day 属性只在 time-picker 组件 type 为 timerange 时生效
    const allowCrossDayProp = computed(() => (panel.value === 'RangeTimePickerPanel' ? props.allowCrossDay : false));

    const inputRef = ref(null);
    // const inputFocus = () => {
    //   inputRef?.value?.focus();
    // };

    const { proxy } = getCurrentInstance();

    const pickerDropdownRef = ref(null);

    watch(
      () => state.visible,
      visible => {
        if (visible) {
          pickerDropdownRef.value?.forceUpdate?.();
          nextTick(() => {
            (proxy as any).pickerPanelRef?.timeSpinnerRef?.updateScroll();
          });
        }
      },
    );

    watch(
      () => props.modelValue,
      modelValue => {
        state.internalValue = parseDate(modelValue, props.type, props.multiple, props.format);
        if (props.withValidate) {
          formItem?.validate?.('change');
        }
      },
    );

    watch(
      () => props.open,
      open => {
        state.visible = open === true;
      },
    );

    watch(
      () => props.type,
      type => {
        onSelectionModeChange(type);
      },
    );

    watch(
      () => publicVModelValue,
      (now, before) => {
        const newValue = JSON.stringify(now);
        const oldValue = JSON.stringify(before);
        const shouldEmitInput = newValue !== oldValue || typeof now !== typeof before;
        if (shouldEmitInput) {
          emit('input', now);
        }
      },
    );

    watch(
      () => state.internalValue,
      v => {
        state.tmpValue = v;
      },
    );

    onMounted(() => {
      // 如果是 date-picker 那么 time-picker 就是回车模式
      if (props.type.indexOf('date') > -1) {
        state.timeEnterMode = true;
      } else {
        // 如果不是 date-picker 那么 time-picker 就是 time 的 props enter-mode
        // state.timeEnterMode = this.enterMode;
        state.timeEnterMode = true;
      }

      const initialValue = props.modelValue;
      const parsedValue = publicVModelValue.value;
      if (typeof initialValue !== typeof parsedValue || JSON.stringify(initialValue) !== JSON.stringify(parsedValue)) {
        emit('input', publicVModelValue.value);
      }
      if (props.open !== null) {
        state.visible = props.open;
      }

      // this.$on('focus-input', () => this.focus())
      // provide(datePickerKey, {
      //   props,
      //   focus: () => inputFocus(),
      // });
    });

    provide(timePickerKey, {
      panelDate: state.focusedDate,
      parentName: proxy.$options.name,
    });

    const pickerPanelRef = ref(null);
    const handleClose = (e?: Event) => {
      if (state.disableCloseUnderTransfer) {
        state.disableCloseUnderTransfer = false;
        return false;
      }

      if (e && e.type === 'mousedown' && state.visible) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (state.visible) {
        const pickerPanel = pickerPanelRef?.value?.$el;
        if (e && pickerPanel?.contains(e.target)) {
          return;
        }

        state.visible = false;
        e?.preventDefault();
        e?.stopPropagation();
        return;
      }

      state.isFocused = false;
      state.disableClickOutSide = false;
    };

    const handleIconClick = () => {
      inputRef?.value?.focus();
      inputRef?.value?.click();
    };

    const handleInputMouseenter = () => {
      if (props.readonly || props.disabled) {
        return;
      }
      if (visualValue?.value) {
        state.showClose = true;
      }
      state.internalValue = state.tmpValue;
    };

    const handleInputMouseleave = _e => {
      // if (e.toElement?.classList.contains('clear-action')) {
      //   return;
      // }
      state.showClose = false;
      state.internalValue = state.tmpValue;
    };

    const emitChange = type => {
      nextTick(() => {
        // 使用 :value 或 :model-value 的时候才需要 handleChange，此时没有触发 update:modelValue
        // 使用 v-model 时才会触发 update:modelValue 事件
        emit('update:modelValue', publicVModelValue.value);
        emit('change', publicStringValue.value, type);
        // this.dispatch('bk-form-item', 'form-change');
        if (props.type.indexOf('time') < 0) {
          inputRef?.value?.blur();
        }
      });
    };

    const handleInputChange = e => {
      const isArrayValue = props.type.includes('range') || props.multiple;
      const oldValue = visualValue.value;
      const newValue = e.target.value;
      const newDate = parseDate(newValue, props.type, props.multiple, props.format);
      const valueToTest = isArrayValue ? newDate : newDate[0];
      const isDisabled = props.disabledDate?.(valueToTest);
      const isValidDate = newDate.reduce((valid, date) => valid && date instanceof Date, true);

      if (newValue !== oldValue && !isDisabled && isValidDate) {
        emitChange(props.type);
        state.internalValue = newDate;
      } else {
        state.forceInputRerender = state.forceInputRerender + 1;
      }
    };

    const handleInputInput = e => {
      const isArrayValue = props.type.includes('range') || props.multiple;
      const oldValue = visualValue.value;
      const newValue = e.target.value;
      const newDate = parseDate(newValue, props.type, props.multiple, props.format);
      const valueToTest = isArrayValue ? newDate : newDate[0];
      const isDisabled = props.disabledDate?.(valueToTest);
      const isValidDate = newDate.reduce((valid, date) => valid && date instanceof Date, true);

      if (newValue !== oldValue && !isDisabled && isValidDate) {
        state.tmpValue = newDate;
      }
    };

    const handleFocus = e => {
      if (props.readonly) {
        return;
      }
      teleportTo.value = getFullscreenRoot();
      state.isFocused = true;
      if (e && e.type === 'focus') {
        return;
      }
      if (!props.disabled) {
        state.visible = true;
        // emit('changeVisible', state.visible);
      }
    };

    const reset = () => {
      pickerPanelRef?.value?.reset?.();
    };

    const handleBlur = e => {
      if (state.internalFocus) {
        state.internalFocus = false;
        return;
      }
      if (state.visible) {
        e.preventDefault();
        return;
      }

      state.isFocused = false;
      onSelectionModeChange(props.type);
      state.internalValue = state.internalValue.slice();
      reset();
      pickerPanelRef?.value?.onToggleVisibility(false);
      formItem?.validate?.('blur');
    };

    const handleKeydown = (e: KeyboardEvent) => {
      const { keyCode } = e;
      // tab
      if (keyCode === 9) {
        if (state.visible) {
          e.stopPropagation();
          e.preventDefault();

          if (isConfirm.value) {
            // const selector = '.bk-picker-confirm > *';
            const selector = `.${resolveClassName('picker-confirm > *')}`;
            const tabbable = pickerDropdownRef.value.$el.querySelectorAll(selector);
            state.internalFocus = true;
            const element = [...tabbable][e.shiftKey ? 'pop' : 'shift']();
            element.focus();
          } else {
            handleClose();
          }
        } else {
          // this.focused = false;
        }
      }

      // left, top, right, bottom
      const arrows = [37, 38, 39, 40];
      if (!state.visible && arrows.includes(keyCode)) {
        state.visible = true;
        // emit('changeVisible', state.visible);
        return;
      }

      // esc
      if (keyCode === 27) {
        if (state.visible) {
          e.stopPropagation();
          handleClose();
        }
      }

      // enter
      // if (keyCode === 13 && state.timeEnterMode) {
      //   const timePickers = findChildComponents(this, 'TimeSpinner');
      //   if (timePickers.length > 0) {
      //     const columnsPerPicker = timePickers[0].showSeconds ? 3 : 2;
      //     const pickerIndex = Math.floor(state.focusedTime.column / columnsPerPicker);
      //     const value = state.focusedTime.time[pickerIndex];
      //     timePickers[pickerIndex].chooseValue(value);
      //     return;
      //   }
      // }

      if (!arrows.includes(keyCode)) {
        return;
      }

      if (state.focusedTime.active) {
        e.preventDefault();
      }

      // const timePickers = findChildComponents(this, 'TimeSpinner');
      // if (timePickers.length > 0) {
      //   this.navigateTimePanel(keyValueMapper[keyCode]);
      // }
    };

    const handleClear = () => {
      state.visible = false;
      // emit('changeVisible', state.visible);
      state.internalValue = state.internalValue.map(() => null);
      emit('clear');
      emitChange(props.type);
      reset();
      state.showClose = false;
      state.shortcut = null;

      setTimeout(() => onSelectionModeChange(props.type), 500);
    };

    const handleTransferClick = () => {
      if (props.appendToBody) {
        state.disableCloseUnderTransfer = true;
      }
    };

    const onPickSuccess = () => {
      state.visible = false;

      // 点击 shortcuts 会关闭弹层时，如果不在 nextTick 里触发 pick-success，那么会导致触发 pick-success 的时候，
      // v-model 的值还是之前的值
      nextTick(() => {
        emit('pick-success');
      });

      inputRef?.value?.blur();
      reset();
    };

    const onPick = (_dates, visible = false, type, shortcut) => {
      let dates = _dates;
      if (props.multiple) {
        const pickedTimeStamp = dates.getTime();
        const indexOfPickedDate = state.internalValue.findIndex(date => date && date.getTime() === pickedTimeStamp);
        const allDates = [...state.internalValue, dates].filter(Boolean);
        const timeStamps = allDates
          .map(date => date.getTime())
          .filter((ts, i, arr) => arr.indexOf(ts) === i && i !== indexOfPickedDate);
        state.internalValue = timeStamps.map(ts => new Date(ts));
      } else {
        // dates = this.parseDate(dates);
        dates = parseDate(_dates, props.type, props.multiple, props.format);
        state.internalValue = Array.isArray(dates) ? dates : [dates];
      }

      if (state.internalValue[0]) {
        // state.focusedDate = state.internalValue[0];
        const [v] = state.internalValue;
        state.focusedDate = v;
      }

      state.focusedTime = {
        ...state.focusedTime,
        time: state.internalValue.map(extractTime),
      };

      if (!isConfirm.value) {
        onSelectionModeChange(props.type);
        state.visible = visible;
      }

      // 点击至今后，datetimerange 不关闭弹框，因为有可能需要修改开始日期的时间，daterange 可以直接关闭弹框
      if (type === 'upToNow' && props.type === 'daterange') {
        onPickSuccess();
      }

      state.shortcut = shortcut;
      emitChange(type);

      // 抛出快捷项选择变化事件
      const shortcutIndex = props.shortcuts.findIndex(item => item === state.shortcut);
      emit('shortcut-change', state.shortcut, shortcutIndex);
    };

    const triggerRef = ref<HTMLElement>(null);

    return {
      ...toRefs(state),
      panel,
      publicStringValue,
      opened,
      visualValue,
      displayValue,
      isConfirm,
      hasHeader,
      hasFooter,
      hasShortcuts,
      fontSizeCls,
      longWidthCls,
      localReadonly,
      allowCrossDayProp,
      ownPickerProps,

      pickerDropdownRef,
      inputRef,
      triggerRef,
      pickerPanelRef,
      teleportTo,
      handleClose,
      handleIconClick,
      handleInputMouseenter,
      handleInputMouseleave,
      handleFocus,
      handleBlur,
      handleKeydown,
      handleInputChange,
      handleInputInput,
      handleClear,
      handleTransferClick,
      onPick,
      onPickSuccess,
      resolveClassName,
    };
  },
  render() {
    const defaultTrigger = (
      <div>
        <span
          class={['icon-wrapper', this.disabled ? 'disabled' : '']}
          onClick={this.handleIconClick}
        >
          {this.type === 'time' || this.type === 'timerange' ? timeIcon : dateIcon}
        </span>
        <input
          key={this.forceInputRerender}
          ref='inputRef'
          class={[
            this.resolveClassName('date-picker-editor'),
            this.readonly ? 'readonly' : '',
            this.fontSizeCls,
            this.behavior === 'simplicity' ? 'only-bottom-border' : '',
          ]}
          disabled={this.disabled}
          placeholder={this.placeholder}
          readonly={this.localReadonly}
          type='text'
          value={this.displayValue}
          onBlur={this.handleBlur}
          onChange={this.handleInputChange}
          onClick={this.handleFocus}
          onFocus={this.handleFocus}
          onInput={this.handleInputInput}
          onKeydown={this.handleKeydown}
        />
        {this.clearable && this.showClose ? (
          <Close
            class='clear-action'
            onClick={this.handleClear}
          />
        ) : (
          ''
        )}
      </div>
    );

    const shortcutsSlot = this.hasShortcuts ? { shortcuts: () => this.$slots.shortcuts?.() || null } : {};

    return (
      <div
        class={[this.resolveClassName('date-picker'), this.type === 'datetimerange' ? 'long' : '', this.longWidthCls]}
        v-clickoutside={this.handleClose}
      >
        <div
          ref='triggerRef'
          class={this.resolveClassName('date-picker-rel')}
          onMouseenter={this.handleInputMouseenter}
          onMouseleave={this.handleInputMouseleave}
        >
          {this.$slots.trigger?.(this.displayValue) ?? defaultTrigger}
        </div>
        <Teleport
          disabled={!this.appendToBody}
          to={this.teleportTo}
        >
          <Transition name='bk-fade-down-transition'>
            <PickerDropdown
              ref='pickerDropdownRef'
              class={[this.appendToBody ? this.resolveClassName('date-picker-transfer') : '']}
              v-show={this.opened}
              appendToBody={this.appendToBody}
              extPopoverCls={this.extPopoverCls}
              placement={this.placement}
              triggerRef={this.triggerRef}
              onClick={this.handleTransferClick}
            >
              {this.hasHeader ? (
                <div class={[this.resolveClassName('date-picker-top-wrapper'), this.headerSlotCls]}>
                  {this.$slots.header?.() ?? null}
                </div>
              ) : null}
              {this.panel === 'RangeTimePickerPanel' ? (
                <TimeRangePanel
                  ref='pickerPanelRef'
                  v-slots={shortcutsSlot}
                  allowCrossDay={this.allowCrossDayProp}
                  clearable={this.clearable}
                  disabledDate={this.disabledDate}
                  disabledHours={this.ownPickerProps.disabledHours}
                  disabledMinutes={this.ownPickerProps.disabledMinutes}
                  disabledSeconds={this.ownPickerProps.disabledSeconds}
                  format={this.format}
                  multiple={this.multiple}
                  shortcutClose={this.shortcutClose}
                  shortcuts={this.shortcuts}
                  startDate={this.startDate}
                  value={this.internalValue}
                  onPick={this.onPick}
                  onPick-clear={this.handleClear}
                  onPick-success={this.onPickSuccess}
                />
              ) : (
                <TimePanel
                  ref='pickerPanelRef'
                  v-slots={shortcutsSlot}
                  clearable={this.clearable}
                  confirm={this.isConfirm}
                  disabledDate={this.disabledDate}
                  disabledHours={this.ownPickerProps.disabledHours}
                  disabledMinutes={this.ownPickerProps.disabledMinutes}
                  disabledSeconds={this.ownPickerProps.disabledSeconds}
                  format={this.format}
                  multiple={this.multiple}
                  shortcutClose={this.shortcutClose}
                  shortcuts={this.shortcuts}
                  startDate={this.startDate}
                  value={this.internalValue}
                  onPick={this.onPick}
                  onPick-clear={this.handleClear}
                  onPick-success={this.onPickSuccess}
                />
              )}
              {this.hasFooter ? (
                <div class={[this.resolveClassName('date-picker-footer-wrapper'), this.footerSlotCls]}>
                  {this.$slots.footer?.() ?? null}
                </div>
              ) : null}
            </PickerDropdown>
          </Transition>
        </Teleport>
      </div>
    );
  },
});

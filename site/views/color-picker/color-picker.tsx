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

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import BaseDemo from './base-demo.vue';
import PresetDemo from './preset-demo.vue';
import SizeDemo from './size-demo.vue';
import SlotDemo from './slot-demo.vue';

const colorPickerPropsJson: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'String',
    default: '""',
    desc: '当前选择的RGB颜色值',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '有三种尺寸：大、默认（中）、小。',
    optional: ['large', 'small'],
  },
  {
    name: 'show-value',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示当前选择的RGB颜色值',
    optional: ['true', 'false'],
  },
  {
    name: 'transfer',
    type: 'Boolean',
    default: 'false',
    desc: '控制颜色面板是否出现在 body 内',
    optional: ['true', 'false'],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
    optional: ['true', 'false'],
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '是否只读',
    optional: ['true', 'false'],
  },
  {
    name: 'recommend',
    type: 'Boolean/Array',
    default: 'true',
    desc: '是否显示预设值，true 展示组件内置预设值，false 不展示预设值，数组自定义预设值',
    optional: [],
  },
  {
    name: 'recommend-empty',
    type: 'Boolean',
    default: 'true',
    desc: '预设值中是否包含空值',
    optional: ['true', 'false'],
  },
  {
    name: 'with-validate',
    type: 'Boolean',
    default: 'true',
    desc: '在表单中时，是否应用 form-item 的校验规则',
    optional: ['true', 'false'],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-color-picker 上',
    optional: [],
  },
];

const colorPickerChangePropsJson: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function',
    default: '',
    desc: '当前选择的RGB颜色值变化时调用',
    optional: [],
  },
];
const optionSlotJson = [
  {
    name: 'trigger',
    type: 'Slot',
    default: null,
    desc: '选项插槽',
    optional: [],
  },
];

export default defineComponent({
  setup() {},
  render() {
    return (
      <div>
        <DemoTitle
          desc='用于颜色选择，支持多种颜色格式，支持颜色预设。'
          name='ColorPicker 颜色选择器'
        />

        <DemoBox
          componentName='color-picker'
          demoName='base-demo'
          desc='使用 bk-color-picker 标签配置颜色选择器组件'
          title='基础用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          componentName='color-picker'
          demoName='size-demo'
          desc='选择器有三种尺寸：大、默认（中）、小。'
          title='不同尺寸'
        >
          <SizeDemo></SizeDemo>
        </DemoBox>
        <DemoBox
          componentName='color-picker'
          demoName='size-demo'
          desc='trigger slot '
          title='自定义slot'
        >
          <SlotDemo></SlotDemo>
        </DemoBox>

        <DemoBox
          componentName='color-picker'
          demoName='preset-demo'
          desc='当 recommend 属性为 true 时显示推荐的颜色预设，为 false 时关闭预设，也可传入数组自定义预设。'
          title='颜色预设'
        >
          <PresetDemo></PresetDemo>
        </DemoBox>

        <PropsBox
          propsData={colorPickerPropsJson}
          title='BkColorPicker 属性'
        />

        <PropsBox
          propsData={colorPickerChangePropsJson}
          title='BkColorPicker 事件'
        />

        <PropsBox
          propsData={optionSlotJson}
          subtitle=''
          title='插槽'
        />
      </div>
    );
  },
});

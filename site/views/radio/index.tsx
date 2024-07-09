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
import { type IPropsTableItem } from '../../typings';
import DemoRadio from './demo/radio.vue';
import DemoRadioButton from './demo/radio-button.vue';
import DemoRadioCard from './demo/radio-card.vue';
import DemoRadioChecked from './demo/radio-checked.vue';
import DemoRadioDisabled from './demo/radio-disabled.vue';
import DemoRadioGroup from './demo/radio-group.vue';
import DemoRadioGroupCapsule from './demo/radio-group-capsule.vue';

const radioProps: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'String',
    default: null,
    desc: '绑定值',
    optional: [],
  },
  {
    name: 'label',
    type: 'String / Number / Boolean',
    default: null,
    desc: '选中状态的值',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用',
    optional: [],
  },
  {
    name: 'checked',
    type: 'Boolean',
    default: 'false',
    desc: '默认是否选中',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: null,
    desc: '尺寸',
    optional: ['large', 'small'],
  },
  {
    name: 'beforeChange',
    type: 'function',
    default: null,
    desc: '值改变之前的回调函数，返回值为 false 会终止值改变',
    optional: [],
  },
];

const radioEvents: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'String',
    default: null,
    desc: '当绑定值变化时触发的事件',
    optional: [],
  },
];

const radioGroupProps: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'String',
    default: null,
    desc: '绑定值',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: null,
    desc: '尺寸',
    optional: ['large', 'small'],
  },
  {
    name: 'withValidate',
    type: 'Boolean',
    default: true,
    desc: '值改变时是否触发表单的校验',
  },
  {
    name: 'beforeChange',
    type: 'function',
    default: null,
    desc: '值改变之前的回调函数，返回值为 false 会终止值改变',
    optional: [],
  },
];

const radioGroupEvents: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'String',
    default: null,
    desc: '当绑定值变化时触发的事件',
    optional: [],
  },
];

const radioButtonProps: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'String',
    default: null,
    desc: '绑定值',
    optional: [],
  },
  {
    name: 'label',
    type: 'String / Number / Boolean',
    default: null,
    desc: '选中状态的值',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用',
    optional: [],
  },
  {
    name: 'checked',
    type: 'Boolean',
    default: 'false',
    desc: '默认是否选中',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: null,
    desc: '尺寸',
    optional: ['large', 'small'],
  },
  {
    name: 'before-change',
    type: '(event: boolean | number | string) => Promise<boolean> | boolean',
    default: '() => true',
    desc: '值改变之前的回调函数，返回值为 false 会终止值改变',
  },
];

const radioButtonEvents: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'String',
    default: null,
    desc: '当绑定值变化时触发的事件',
    optional: [],
  },
];

export default defineComponent({
  name: 'Radio',
  render() {
    return (
      <div>
        <DemoTitle
          desc='表单-单选框，在一组选项中进行单选'
          designLink='https://bkdesign.bk.tencent.com/design/128'
          name='Radio'
        />
        <DemoBox
          componentName='radio'
          demoName='/demo/radio'
          desc=''
          title='基础用法'
        >
          <DemoRadio />
        </DemoBox>
        <DemoBox
          componentName='radio'
          demoName='/demo/radio-group'
          desc='配合 bk-radio-group 使用'
          title='单选框组'
        >
          <DemoRadioGroup />
        </DemoBox>
        <DemoBox
          componentName='radio'
          demoName='/demo/radio-checked'
          desc=''
          title='默认选中'
        >
          <DemoRadioChecked />
        </DemoBox>
        <DemoBox
          componentName='radio'
          demoName='/demo/radio-disabled'
          desc=''
          title='禁用状态'
        >
          <DemoRadioDisabled />
        </DemoBox>

        <DemoBox
          componentName='radio'
          demoName='/demo/radio-button'
          desc=''
          title='按钮样式'
        >
          <DemoRadioButton />
        </DemoBox>

        <DemoBox
          componentName='radio'
          demoName='/demo/radio-card'
          desc='100%充满父容器，每个子项等分父容器宽度'
          title='卡片样式'
        >
          <DemoRadioCard />
        </DemoBox>

        <DemoBox
          componentName='radio'
          demoName='/demo/radio-group-capsule'
          desc=''
          title='胶囊样式'
        >
          <DemoRadioGroupCapsule />
        </DemoBox>

        <PropsBox
          propsData={radioGroupProps}
          subtitle=''
          title='Radios-Groups 属性'
        />
        <PropsBox
          propsData={radioProps}
          subtitle=''
          title='Radios 属性'
        />
        <PropsBox
          propsData={radioButtonProps}
          subtitle=''
          title='Radios-Button 属性'
        />
        <PropsBox
          propsData={radioGroupEvents}
          subtitle=''
          title='Radios-Groups 事件'
        />
        <PropsBox
          propsData={radioEvents}
          subtitle=''
          title='Radios 事件'
        />
        <PropsBox
          propsData={radioButtonEvents}
          subtitle=''
          title='Radios-Button 事件'
        />
      </div>
    );
  },
});

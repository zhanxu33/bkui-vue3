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
import BeforeChangeDemo from './before-change-demo.vue';
import DisabledDemo from './disabled-demo.vue';
import SizeDemo from './size-demo.vue';
import TextDemo from './text-demo.vue';
import ThemeDemo from './theme-demo.vue';
import TypeDemo from './type-demo.vue';

const switcherPropsJson: IPropsTableItem[] = [
  {
    name: 'value',
    type: 'String | Number | Boolean',
    default: 'false',
    desc: '是否打开',
    optional: [],
  },
  {
    name: 'model-value',
    type: 'String | Number | Boolean',
    default: false,
    desc: '双向绑定的值',
    optional: [],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'success',
    desc: '开关的主题',
    optional: ['primary', 'success'],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
    optional: [],
  },
  {
    name: 'show-text',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示文本',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: '',
    desc: '尺寸，显示文本时此属性无效',
    optional: ['large', 'small'],
  },
  {
    name: 'is-outline',
    type: 'Boolean',
    default: 'false',
    desc: '是否为描边效果',
    optional: [],
  },
  {
    name: 'is-square',
    type: 'Boolean',
    default: 'false',
    desc: '是否为方形效果',
    optional: [],
  },
  {
    name: 'true-value',
    type: 'Boolean',
    default: 'true',
    desc: '表示开状态的值',
    optional: [],
  },
  {
    name: 'false-value',
    type: 'Boolean',
    default: 'false',
    desc: '表示关状态的值',
    optional: [],
  },
  {
    name: 'on-text',
    type: 'String',
    default: 'ON',
    desc: '打开状态显示的文本',
    optional: [],
  },
  {
    name: 'off-text',
    type: 'String',
    default: 'OFF',
    desc: '关闭状态显示的文本',
    optional: [],
  },
  {
    name: 'before-change',
    type: 'Function',
    default: '',
    desc: '状态切换的前置检测接收操作后的状态（lastValue），返回true，false，Promise',
    optional: [],
  },
  {
    name: 'with-validate',
    type: 'Boolean',
    default: true,
    desc: '是否在切换时进行校验',
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: '自定义样式类名',
    optional: [],
  },
];

const switcherChangeJson: IPropsTableItem[] = [
  {
    name: 'update:modelValue',
    type: 'Function',
    default: '-',
    desc: '更新 modelValue 的事件',
    optional: [],
  },
  {
    name: 'change',
    type: 'Function',
    default: '-',
    desc: '状态发生变化时触发的事件',
    optional: [],
  },
];

export default defineComponent({
  setup() {},
  render() {
    return (
      <div>
        <DemoTitle
          desc='在两种状态之间的切换'
          designLink='https://bkdesign.bk.tencent.com/design/118'
          name='Switcher 开关'
        />

        <DemoBox
          componentName='switcher'
          demoName='base-demo'
          desc='可以通过 value / v-model 属性来定义开关状态，'
          subtitle=''
          title='基础用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          componentName='switcher'
          demoName='size-demo'
          desc='可以通过 size 属性来定义开关的尺寸，需要更大或更小尺寸时使用 large、small 值配置，不配置即为默认尺寸。当设置 show-text 时将显示为特定尺寸同时 size 将失效。'
          subtitle=''
          title='尺寸'
        >
          <SizeDemo></SizeDemo>
        </DemoBox>

        <DemoBox
          componentName='switcher'
          demoName='theme-demo'
          desc='可以通过 theme 属性来定义开关的主题'
          subtitle=''
          title='主题'
        >
          <ThemeDemo></ThemeDemo>
        </DemoBox>

        <DemoBox
          componentName='switcher'
          demoName='disabled-demo'
          desc='可以使用 disabled 属性来定义开关是否禁用，它接受一个 Boolean 值'
          subtitle='不可用状态'
          title='禁用状态'
        >
          <DisabledDemo></DisabledDemo>
        </DemoBox>

        <DemoBox
          componentName='switcher'
          demoName='before-change-demo'
          desc='可以通过 before-change 接收一个函数来做前置状态检测，返回 false状态切换失败；返回true状态切换成功；返回一个promise，resolve状态切换成功，reject状态切换失败'
          subtitle=''
          title='前置状态检测'
        >
          <BeforeChangeDemo></BeforeChangeDemo>
        </DemoBox>

        <DemoBox
          componentName='switcher'
          demoName='text-demo'
          desc='可以通过 onText/offText 来修改展示的文案'
          subtitle=''
          title='自定义文案'
        >
          <TextDemo></TextDemo>
        </DemoBox>

        <DemoBox
          componentName='switcher'
          demoName='type-demo'
          desc=''
          subtitle=''
          title='更多示例'
        >
          <TypeDemo></TypeDemo>
        </DemoBox>

        <PropsBox
          propsData={switcherPropsJson}
          subtitle=''
          title='Switcher 属性'
        />

        <PropsBox
          propsData={switcherChangeJson}
          subtitle=''
          title='Switcher 事件'
        />
      </div>
    );
  },
});

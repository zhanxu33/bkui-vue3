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
import EditDemo from './edit-demo.vue';
import SizeDemo from './size-demo.vue';

const ratePropsJson: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'Number',
    default: '0',
    desc: '分数',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: 'default',
    desc: '尺寸',
    optional: ['small', 'default', 'large', 'huge'],
  },
  {
    name: 'editable',
    type: 'Boolean',
    default: 'true',
    desc: '是否可编辑',
    optional: [],
  },
  {
    name: 'withValidate',
    type: 'Boolean',
    default: 'true',
    desc: '值改变的时候是否触发校验',
    optional: [],
  },
];

const rateEventJson: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function',
    default: '',
    desc: '评分发生变化的时候',
    optional: [],
  },
  {
    name: 'hover-change',
    type: 'Function',
    default: '',
    desc: '鼠标hover评分的时候',
    optional: [],
  },
];

export default defineComponent({
  setup() {},
  render() {
    return (
      <div>
        <DemoTitle
          desc='评分组件'
          designLink='https://bkdesign.bk.tencent.com/design/147'
          name='Rate 评分'
        />

        <DemoBox
          componentName='rate'
          demoName='base-demo'
          desc='通过 editable 设置为 false, 让 rate 组件只能查看不能编辑，只有非编辑态可以展示小数'
          subtitle=''
          title='基础用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          componentName='rate'
          demoName='size-demo'
          desc='通过 size 属性控制组件大小'
          subtitle=''
          title='控制组件大小'
        >
          <SizeDemo></SizeDemo>
        </DemoBox>

        <DemoBox
          componentName='rate'
          demoName='edit-demo'
          desc='通过监听 change 事件来做出响应'
          subtitle=''
          title='监听 change 事件'
        >
          <EditDemo></EditDemo>
        </DemoBox>

        <PropsBox
          propsData={ratePropsJson}
          subtitle=''
          title='Rate 属性'
        />

        <PropsBox
          propsData={rateEventJson}
          subtitle=''
          title='Rate 事件'
        />
      </div>
    );
  },
});

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

import BkResizeLayout from '@bkui-vue/resize-layout';
import { kebabCase } from 'lodash';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import AdvanceDemo from './advance-demo.vue';
import AutoMiniMizeDemo from './auto-minimize-demo.vue';
import BaseDemo from './base-demo.vue';
import CollapsibleDemo from './collapsible-demo.vue';
import ImmediateDemo from './immediate-demo.vue';

const propsJson: IPropsTableItem[] = Object.keys(BkResizeLayout.props).map(prop => ({
  name: kebabCase(prop),
  type: BkResizeLayout.props[prop]._vueTypes_name,
  default: BkResizeLayout.props[prop].default,
  desc: '',
  optional: [],
}));
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='通过拉伸侧栏调整布局大小'
          designLink='https://bkdesign.bk.tencent.com/design/156'
          name='Resize Layout'
        />
        <DemoBox
          componentName='resize-layout'
          demoName='base-demo'
          desc=''
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='auto-minimize-demo'
          desc=''
          title='最小化'
        >
          <AutoMiniMizeDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='immediate-demo'
          desc=''
          title='实时拉伸'
        >
          <ImmediateDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='collapsible-demo'
          desc=''
          title='可折叠'
        >
          <CollapsibleDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='advance-demo'
          desc=''
          title='多级嵌套'
        >
          <AdvanceDemo />
        </DemoBox>
        <PropsBox
          propsData={propsJson}
          subtitle=''
        />
      </div>
    );
  },
});

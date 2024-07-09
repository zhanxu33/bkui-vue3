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

import { computed, defineComponent, h, onMounted, PropType, ref } from 'vue';

import { bkTooltips } from '@bkui-vue/directives';
import { IOptions } from '@bkui-vue/directives/src/tooltips';
import { checkOverflow, PropTypes } from '@bkui-vue/shared';
import _ from 'lodash';

export default defineComponent({
  name: 'TagRender',
  directives: {
    bkTooltips,
  },
  props: {
    node: PropTypes.object,
    displayKey: PropTypes.string,
    tooltipKey: PropTypes.string,
    tpl: {
      type: Function,
    },
    hasTips: {
      type: Boolean,
      default: false,
    },
    tagOverflowTips: {
      type: Object as PropType<Partial<IOptions>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const tagRef = ref();
    const isOverflow = ref(false);
    const overflowTips = computed(() => ({
      boundary: 'window',
      theme: 'light',
      distance: 12,
      content: props.node[props.tooltipKey],
      disabled: !_.has(props.node, props.tooltipKey) || !isOverflow.value,
      ...props.tagOverflowTips,
    }));

    onMounted(() => {
      isOverflow.value = checkOverflow(tagRef.value);
    });

    return {
      overflowTips,
      tagRef,
    };
  },
  render() {
    if (this.tpl) {
      return this.tpl(this.node, h, this);
    }

    return (
      <div
        ref='tagRef'
        class='tag'
        v-bk-tooltips={this.overflowTips}
      >
        <span class='text'>{this.node[this.displayKey]}</span>
      </div>
    );
  },
});

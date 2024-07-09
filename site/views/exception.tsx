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

import { defineComponent, ref } from 'vue';

import BkButton from '@bkui-vue/button';
import BkException from '@bkui-vue/exception';

export default defineComponent({
  name: 'SiteException',
  setup() {
    const type = ref('404');
    function handleClick() {
      console.log('button click');
      type.value = '500';
    }
    return {
      type,
      handleClick,
    };
  },
  render() {
    return (
      <div>
        <div
          style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'
          onClick={this.handleClick}
        >
          <BkException
            scene='page'
            type={this.type}
          ></BkException>
        </div>
        <div style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='page'
            type='403'
          ></BkException>
        </div>
        <div style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='page'
            type='500'
          ></BkException>
        </div>
        <div style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='page'
            type='building'
          ></BkException>
        </div>
        <div style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='page'
            type='empty'
          ></BkException>
        </div>
        <div style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='page'
            type='search-empty'
          ></BkException>
        </div>
        <div style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='page'
            type='login'
          ></BkException>
        </div>
        <div style='min-height: 300px; padding: 10px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='page'
            type='login'
          >
            <div class='slot-default'>
              <div>这里是描述</div>
              <BkButton>走你</BkButton>
            </div>
          </BkException>
        </div>
        <div style='display: flex; height: auto; padding: 20px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='part'
            type='404'
          ></BkException>
          <BkException
            scene='part'
            type='403'
          ></BkException>
        </div>
        <div style='display: flex; height: auto; padding: 20px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='part'
            type='500'
          ></BkException>
          <BkException
            scene='part'
            type='building'
          ></BkException>
        </div>
        <div style='display: flex; height: auto; padding: 20px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='part'
            type='empty'
          ></BkException>
          <BkException
            scene='part'
            type='search-empty'
          ></BkException>
        </div>
        <div style='display: flex; height: auto; padding: 20px 0; border: 1px solid #dcdcdc; margin: 10px 0;'>
          <BkException
            scene='part'
            type='login'
          ></BkException>
          <BkException
            scene='part'
            type='login'
          ></BkException>
        </div>
      </div>
    );
  },
});

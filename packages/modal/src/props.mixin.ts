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
import { func } from 'vue-types';

import { PropTypes, renderDirectiveType } from '@bkui-vue/shared';

export const propsMixin = {
  // 是否显示弹框
  isShow: PropTypes.bool.def(false),
  width: PropTypes.oneOfType([String, Number]),
  // 是否全屏
  fullscreen: PropTypes.bool.def(false),
  // 是否允许出现遮罩
  showMask: PropTypes.bool.def(true),
  // 是否显示右上角的关闭 icon
  closeIcon: PropTypes.bool.def(true),
  // 是否允许 esc 按键关闭弹框
  escClose: PropTypes.bool.def(true),
  // 是否允许点击遮罩关闭弹窗
  quickClose: PropTypes.bool.def(true),
  // 是否显示在body内（即与id#app同级
  transfer: PropTypes.oneOfType([Boolean, String, HTMLElement]).def(true),
  // 弹出层z-index，实际显示的值会自动+1。为了抱证在遮罩上正常显示
  zIndex: PropTypes.oneOfType([String, Number]),
  // 动画类型
  animateType: PropTypes.string.def('slide'),
  // 弹框的渲染方式
  renderDirective: renderDirectiveType(),
  // 关闭前回调
  beforeClose: func<() => Promise<boolean> | boolean>().def(() => true),
  left: PropTypes.string,
  top: PropTypes.string,
  extCls: PropTypes.string,
  backgroundColor: PropTypes.string.def(''),
};

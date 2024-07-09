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

import { propsMixin } from '@bkui-vue/modal';
import { AlignEnum, alignType, dialogTypeUnion, PropTypes, ThemeEnum } from '@bkui-vue/shared';
import cloneDeep from 'lodash/cloneDeep';

const dialogProps = cloneDeep(propsMixin);
dialogProps.width.default = '480';

const props = {
  ...dialogProps,

  // 是否可拖拽
  draggable: PropTypes.bool.def(false),
  // 确认按钮文字
  // confirmText: PropTypes.string.def('确定'),
  confirmText: PropTypes.string,
  // 取消按钮文字
  // cancelText: PropTypes.string.def('取消'),
  cancelText: PropTypes.string,
  // 步骤按钮文字
  // prevText: PropTypes.string.def('上一步'),
  prevText: PropTypes.string,
  // nextText: PropTypes.string.def('下一步'),
  nextText: PropTypes.string,
  // 当前步骤
  current: PropTypes.number.def(1),
  // 总步数
  totalStep: PropTypes.number,
  // 弹框的标题
  title: PropTypes.string.def(''),
  // 显示 header 的位置
  headerAlign: alignType().def(AlignEnum.LEFT),
  // 显示 footer 的位置
  footerAlign: alignType().def(AlignEnum.RIGHT),
  // 颜色 按钮类型
  confirmButtonTheme: PropTypes.theme().def(ThemeEnum.PRIMARY),
  // 对话框类型
  dialogType: dialogTypeUnion(),
  // 按钮loading
  isLoading: PropTypes.bool.def(false),
};
export default props;

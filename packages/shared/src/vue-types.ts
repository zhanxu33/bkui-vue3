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

import { CSSProperties, VNodeChild } from 'vue';
import { createTypes, string, toType, VueTypeDef } from 'vue-types';

const propTypesNS = createTypes({});

export type VueNode = JSX.Element | VNodeChild;

// 将一个数组转化为一个有限集合 e.g. const arr = [1,2,3] as const; type UnionType = ElementType<typeof arr>;
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

// 用于创建字符串列表映射至 `K: V` 的函数
export function stringEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

type UnionToIntersection<T> = (T extends any ? (v: T) => void : never) extends (v: infer V) => void ? V : never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
type Push<T extends any[], V> = [...T, V];

export type UnionToArrayType<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = N extends true
  ? []
  : Push<UnionToArrayType<Exclude<T, L>>, L>;

export enum SizeEnum {
  DEFAULT = 'default',
  LARGE = 'large',
  SMALL = 'small',
}

export enum Placements {
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Top = 'top',
}

export enum RenderDirectiveEnum {
  IF = 'if',
  SHOW = 'show',
}

export function renderDirectiveType() {
  return string<`${RenderDirectiveEnum}`>().def(RenderDirectiveEnum.SHOW);
}

export enum AlignEnum {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}
export function alignType() {
  return string<`${AlignEnum}`>().def(AlignEnum.LEFT);
}

export enum ThemeEnum {
  DANGER = 'danger',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
}

/** 弹层出现位置选项 */
export enum PlacementEnum {
  AUTO = 'auto',
  AUTO_END = 'auto-end',
  AUTO_START = 'auto-start',
  BOTTOM = 'bottom',
  BOTTOM_END = 'bottom-end',
  BOTTOM_START = 'bottom-start',
  LEFT = 'left',
  LEFT_END = 'left-end',
  LEFT_START = 'left-start',
  RIGHT = 'right',
  RIGHT_END = 'right-end',
  RIGHT_START = 'right-start',
  TOP = 'top',
  TOP_END = 'top-end',
  TOP_START = 'top-start',
}

export function placementType() {
  return string<`${PlacementEnum}`>().def(PlacementEnum.BOTTOM);
}

/** 弹层触发选项  */
export enum TriggerEnum {
  CLICK = 'click',
  HOVER = 'hover',
  MANUAL = 'manual',
}
export function triggerType() {
  return string<`${TriggerEnum}`>().def(TriggerEnum.HOVER);
}

/** 内容渲染类型：目前是在popover内容渲染时使用 */
export enum RenderType {
  AUTO = 'auto', // 自动配置，默认值，不加干涉，调用方控制
  SHOWN = 'shown', // 默认不渲染，只有在popover弹出之后才会渲染
}

export function renderType() {
  return toType<`${RenderType}`>('popRenderType', {}).def(RenderType.SHOWN);
}

export enum DialogTypeEnum {
  CONFIRM = 'confirm',
  OPERATION = 'operation',
  PROCESS = 'process',
  SHOW = 'show',
}
export function dialogTypeUnion() {
  return toType<`${DialogTypeEnum}`>('dialogType', {
    default: DialogTypeEnum.OPERATION,
  });
}

export enum DirectionEnum {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}
export function directionType() {
  return toType<`${DirectionEnum}`>('direction', {}).def(DirectionEnum.HORIZONTAL);
}

export enum LineStyleEnum {
  DASHED = 'dashed',
  SOLID = 'solid',
}
export function lineStyleType() {
  return toType<`${LineStyleEnum}`>('lineType', {}).def(LineStyleEnum.DASHED);
}

export enum TagThemeEnum {
  DANGER = 'danger',
  INFO = 'info',
  SUCCESS = 'success',
  UNKNOWN = '',
  WARNING = 'warning',
}

export function TagThemeType() {
  return toType<`${TagThemeEnum}`>('tagTheme', {}).def();
}

export enum InputBehaviorEnum {
  NORMAL = 'normal',
  SIMPLICITY = 'simplicity',
}

export enum ProgressStrokeLineCapEnum {
  BUTT = 'butt',
  ROUNDE = 'round',
  SQUARE = 'square',
}

export enum ProgressEnum {
  CIRCLE = 'circle',
  DASHBOARD = 'dashboard',
  LINE = 'line',
}

export enum SwitcherThemeEnum {
  PRIMARY = 'primary',
  SUCCESS = 'success',
}

export enum TimelineNodeTypeEnum {
  TEMPLATE = 'template',
  VNODE = 'vnode',
}

export function SwitcherThemeType() {
  return toType<`${SwitcherThemeEnum}`>('switcherTheme', {}).def(SwitcherThemeEnum.SUCCESS);
}

export function ProgressStrokeLineCapType() {
  return toType<`${ProgressStrokeLineCapEnum}`>('progressStrokeLineCap', {}).def(ProgressStrokeLineCapEnum.ROUNDE);
}

export function ProgressType() {
  return toType<`${ProgressEnum}`>('progress', {}).def(ProgressEnum.LINE);
}

export function InputBehaviorType() {
  return toType<`${InputBehaviorEnum}`>('behavior', {}).def(InputBehaviorEnum.NORMAL);
}

export class PropTypes extends propTypesNS {
  static size() {
    const defaultList = ['small', 'default', 'large', 'huge'] as const;
    type CommonSizeEnum = ElementType<typeof defaultList>;
    return toType<CommonSizeEnum>('Size', {
      validator: (val: CommonSizeEnum) => {
        if (!val || defaultList.includes(val)) {
          return true;
        }
        console.error(`invalid theme, ${val}, the theme must be one of 【${defaultList.join(' | ')}】`);
        return false;
      },
      default: 'default',
    });
  }

  static theme() {
    const themes = ['primary', 'warning', 'success', 'danger'] as const;
    return toType<`${ThemeEnum}`>('Theme', {
      validator: (val: `${ThemeEnum}`) => {
        if (!val || themes.includes(val)) {
          return true;
        }
        console.error(`invalid theme, ${val}, the theme must be one of 【${themes.join(' | ')}】`);
        return false;
      },
    });
  }

  static placement() {
    const placements = ['top', 'left', 'right', 'bottom'] as const;
    type PlacementEnum = ElementType<typeof placements>;
    return toType<PlacementEnum>('Placements', {
      validator: (val: PlacementEnum) => {
        if (!val || placements.includes(val)) {
          return true;
        }
        return false;
      },
      default: 'top',
    });
  }

  static style(): VueTypeDef<CSSProperties> {
    return toType('Style', {
      type: [String, Object],
    });
  }

  static position(positions: string[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']): VueTypeDef<string> {
    return toType('positions', {
      type: String,
      validator: (val: string) => {
        if (!val || positions.includes(val)) {
          return true;
        }
        console.error(`invalid positions, ${val}, the position must be one of 【${positions.join(' | ')}】`);
        return false;
      },
      default: 'top-center',
    });
  }

  static infoType() {
    const type = ['success', 'danger', 'warning', 'loading'] as const;
    type TypeEnum = ElementType<typeof type>;
    return toType<TypeEnum>('InfoType', {
      validator: (val: TypeEnum) => {
        if (!val || type.includes(val)) {
          return true;
        }
        return false;
      },
    });
  }

  static timelineNodeType() {
    const types = ['template', 'vnode'] as const;
    return toType<`${TimelineNodeTypeEnum}`>('TimelineNodeType', {
      validator: (val: `${TimelineNodeTypeEnum}`) => {
        if (!val || types.includes(val)) {
          return true;
        }
        return false;
      },
    });
  }
}

export enum SelectedTypeEnum {
  CHECK = 'check',
  CHECKBOX = 'checkbox',
}

export function SelectedType() {
  return toType<`${SelectedTypeEnum}`>('selectedStyle', {}).def(SelectedTypeEnum.CHECK);
}

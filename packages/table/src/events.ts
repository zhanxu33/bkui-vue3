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

/* eslint-disable @typescript-eslint/naming-convention */
import { SORT_OPTION } from './const';
import { Column, IColumnActive } from './props';

export const enum EMIT_EVENTS {
  CELL_CLICK = 'cellClick',
  CELL_DBL_CLICK = 'cellDblclick',
  COLUMN_FILTER = 'columnFilter',
  COLUMN_FILTER_SAVE = 'colFilterSave',

  COLUMN_PICK = 'columnPick',
  COLUMN_SORT = 'columnSort',
  DRAG_END = 'dragend',
  NATIVE_CLICK = 'click',
  NATIVE_DBL_CLICK = 'dblclick',

  PAGE_LIMIT_CHANGE = 'pageLimitChange',
  PAGE_VALUE_CHANGE = 'pageValueChange',

  ROW_CLICK = 'rowClick',

  ROW_DBL_CLICK = 'rowDblclick',

  ROW_EXPAND_CLICK = 'rowExpand',
  ROW_MOUSE_ENTER = 'rowMouseEnter',
  ROW_MOUSE_LEAVE = 'rowMouseLeave',

  ROW_SELECT = 'select',
  ROW_SELECT_ALL = 'selectAll',

  ROW_SELECT_CHANGE = 'selectionChange',
  SCROLL_BOTTOM = 'scrollBottom',

  SETTING_CHANGE = 'settingChange',
}

export const EVENT_COL_PICK = (_cols: IColumnActive[]) => true;
export const EVENT_COL_FILTER = (_args: { checked: string[]; column: Column; index: number }) => true;
export const EVENT_COL_FILTER_SAVE = (_args: { column: Column; values: any[] }) => true;
export const EVENT_COL_SORT = (_args: { column: Column; index: number; type: SORT_OPTION }) => true;

export const EVENT_MOUSE_FN = (_e: MouseEvent, _row: any, _index: number, _rows: any[], _this: any) => true;

export const EVENT_EXPAND_FN = (_args: { row: any; column: Column; index: number; rows: any[]; e: MouseEvent }) => true;

export const EVENT_ROW_SELECT_FN = (_args: { row: any; index: number; checked: string; data: any[] }) => true;

export const EVENT_ROW_SELECT_ALL_FN = (_args: { checked: string; data: any[] }) => true;

export const EVENT_ROW_SELECT_CHANGE_FN = (_args: {
  row: any;
  index: number;
  checked: string;
  data: any[];
  isAll: boolean;
}) => true;

export const EVENT_PAGE_FN = (_arg: number) => true;
export const EVENT_SETTING_FN = (_args: any) => true;

export const EVENT_CELL_FN = (_args: {
  event: MouseEvent;
  row: any;
  column: Column;
  cell: {
    getValue: () => string;
  };
  rowIndex: number;
  columnIndex: number;
}) => true;

export const EVENT_SCROLL_FN = (_args: {
  translateX: number;
  translateY: number;
  scrollTop: number;
  scrollLeft: number;
  bottom: number;
}) => true;

export const EVENT_DRAGEND_FN = (_args: { sourceEvent: DragEvent; data: any[] }) => true;

export const EMIT_EVENT_TYPES = {
  [EMIT_EVENTS.COLUMN_PICK]: EVENT_COL_PICK,
  [EMIT_EVENTS.COLUMN_FILTER]: EVENT_COL_FILTER,
  [EMIT_EVENTS.COLUMN_SORT]: EVENT_COL_SORT,
  [EMIT_EVENTS.COLUMN_FILTER_SAVE]: EVENT_COL_FILTER_SAVE,

  [EMIT_EVENTS.ROW_CLICK]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.ROW_DBL_CLICK]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.ROW_EXPAND_CLICK]: EVENT_EXPAND_FN,

  [EMIT_EVENTS.ROW_SELECT]: EVENT_ROW_SELECT_FN,
  [EMIT_EVENTS.ROW_SELECT_ALL]: EVENT_ROW_SELECT_ALL_FN,
  [EMIT_EVENTS.ROW_SELECT_CHANGE]: EVENT_ROW_SELECT_CHANGE_FN,

  [EMIT_EVENTS.PAGE_LIMIT_CHANGE]: EVENT_PAGE_FN,
  [EMIT_EVENTS.PAGE_VALUE_CHANGE]: EVENT_PAGE_FN,

  [EMIT_EVENTS.SETTING_CHANGE]: EVENT_SETTING_FN,
  [EMIT_EVENTS.SCROLL_BOTTOM]: EVENT_SCROLL_FN,

  [EMIT_EVENTS.CELL_CLICK]: EVENT_CELL_FN,
  [EMIT_EVENTS.CELL_DBL_CLICK]: EVENT_CELL_FN,

  [EMIT_EVENTS.ROW_MOUSE_ENTER]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.ROW_MOUSE_LEAVE]: EVENT_MOUSE_FN,

  [EMIT_EVENTS.DRAG_END]: EVENT_DRAGEND_FN,
} as Record<string, (...args) => boolean>;

export const CELL_EVENT_TYPES = {
  [EMIT_EVENTS.NATIVE_CLICK]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.NATIVE_DBL_CLICK]: EVENT_MOUSE_FN,
};

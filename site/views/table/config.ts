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
export default [
  {
    title: 'bk-table 默认设置',
    subTile: '内置的默认配置属性和默认值（只读），可以通过具体的属性配置进行覆盖',
    config: [
      {
        name: 'LINE_HEIGHT',
        type: 'Number',
        default: '42',
        desc: '默认行高, 用于默认设置,(Table.minHeight = LINE_HEIGHT * 2, Table.rowHeight = LINE_HEIGHT, Table.headHeight = LINE_HEIGHT, Table.thead.height=LINE_HEIGHT)，可以通过具体属性配置进行覆盖',
        optional: [],
      },
      { name: 'SCROLLY_WIDTH', type: 'Number', default: '4', desc: '默认滚动条样式宽度', optional: [] },
      {
        name: 'COL_MIN_WIDTH',
        type: 'Number',
        default: '30',
        desc: '默认最小列宽，如果需要调整最小列宽，可以通过column.minWidth进行设置，覆盖默认宽度',
        optional: [],
      },
      {
        name: 'SETTING_SIZE',
        type: 'Array',
        default: 'small',
        desc: 'Setting 行高默认列表，默认 small (LINE_HEIGHT),如果需要自定义列表，参考 ISettings.sizeList',
        optional: ['large: 78', 'medium: 60', 'small: LINE_HEIGHT'],
      },
      {
        name: 'ROW_KEY',
        type: 'string',
        default: 'UUID',
        desc: '每行数据的唯一id，如果 没有明确指定 row-key,则会默认内置生成UUID作为唯一标识，在启用服务器端分页或者自定义渲染内置自定义组件的场景下，建议明确设置row-key,以保证在数据更新时能够正确渲染组件内容',
        optional: [],
      },
    ],
  },
  {
    title: 'bk-table 属性',
    subTile: '',
    config: [
      { name: 'data', type: 'Array', default: '--', desc: '显示的数据', optional: [] },
      { name: 'columns', type: 'IColumn[]', default: '', desc: '表格列的配置描述，具体项参考IColumn', optional: [] },
      { name: 'stripe', type: 'Boolean', default: 'false', desc: '是否为斑马纹 Table', optional: ['true', 'false'] },
      {
        name: 'active-column',
        type: 'Number|Array',
        default: '--',
        desc: '当前选中列,当设置选中多列时（columnPick = multi），配置为数组[index1, index2, index3]，只能选中单列时，可以为数值或者数组[index]',
        optional: [],
      },
      {
        name: 'column-pick',
        type: 'String',
        default: '禁用（disabled）',
        desc: '表格列选中方式,支持：',
        optional: ['单列（single）', '多列（multi）', '禁用（disabled）'],
      },
      {
        name: 'height',
        type: 'Number|String',
        default: 'auto',
        desc: '设置表格高度,auto 根据行数自动填充高度, 100%，依赖初始化时父级容器高度',
        optional: [],
      },
      { name: 'min-height', type: 'Number|String', default: 'LINE_HEIGHT * 2', desc: '设置表格最小高度', optional: [] },
      {
        name: 'max-height',
        type: 'Number|String',
        default: 'auto，依赖外层高度',
        desc: '设置表格最大高度',
        optional: [],
      },
      {
        name: 'row-height',
        type: 'Number|Function',
        default: 'LINE_HEIGHT',
        desc: '行高，可以为固定数值类型, 可以是函数，返回当前行的高度，返回值为数值类型',
        optional: [],
      },
      {
        name: 'head-height',
        type: 'Number',
        default: 'LINE_HEIGHT',
        desc: 'Thead行高，可以为固定数值类型',
        optional: [],
      },
      { name: 'show-head', type: 'Boolean', default: 'true', desc: '是否显示Head', optional: [] },
      {
        name: 'thead',
        type: 'Object',
        default: '--',
        desc: '表头配置，详细参考IHead，如果同时配置了thead和head-height、show-head，thead优先级最高，会覆盖其他配置',
        optional: [],
      },
      {
        name: 'virtual-enabled',
        type: 'Boolean',
        default: 'false',
        desc: '是否启用虚拟渲染 & 滚动, 当数据量很大时，启用虚拟渲染可以解决压面卡顿问题',
        optional: [],
      },
      {
        name: 'border',
        type: 'Array',
        default: '[BORDER_OPTION.ROW]',
        desc: '表格边框显示设置，可以是一个组合; 生效规则: 除非单独设置 none,否则会追加每个设置',
        optional: ['none', 'row', 'col', 'outer'],
      },
      {
        name: 'pagination',
        type: 'Boolean|Object',
        default: 'false',
        desc: '分页配置, 默认值为false，不启用分页; 设置为 true，启用分页功能，默认值参考分页组件 Pagination',
        optional: [],
      },
      { name: 'remote-pagination', type: 'Boolean', default: 'false', desc: '是否启用远程分页', optional: [] },
      { name: 'empty-text', type: 'String', default: '暂无数据', desc: '空数据展示', optional: [] },
      { name: 'empty-cell-text', type: 'String', default: '', desc: '单元格空数据展示', optional: [] },
      {
        name: 'settings',
        type: 'Object|Boolean',
        default: 'false',
        desc: 'bk-table-setting-content,用于设置表格行高、显示列...，详细参考ISettings',
        optional: [],
      },
      {
        name: 'row-class',
        type: 'String|Object|Function',
        default: '{}',
        desc: '行的 class 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style',
        optional: [],
      },
      { name: 'align', type: 'left|center|right|‘’', default: '--', desc: '表格单元格对齐方式', optional: [] },
      { name: 'header-align', type: 'left|center|right|‘’', default: '--', desc: '表头对齐方式', optional: [] },
      {
        name: 'cell-style',
        type: 'String|Object|Function',
        default: '{}',
        desc: '单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style',
        optional: [],
      },
      {
        name: 'cell-class',
        type: 'String|Object|Function',
        default: '{}',
        desc: '单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className',
        optional: [],
      },
      {
        name: 'scroll-loading',
        type: 'Object|Boolean',
        default: 'undefined',
        desc: '表格底部loading加载效果，可以配合表格scroll-bottom事件使用, 详细配置可参考bk-loading组件',
        optional: [],
      },
      {
        name: 'reserve-expand',
        type: 'Boolean',
        default: 'false',
        desc: '仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的展开收起操作（需指定 row-key）',
        optional: [],
      },
      {
        name: 'row-key',
        type: 'String|Function',
        default: '--',
        desc: '行数据的 Key，用来优化 Table 的渲染。此key用于渲染table row的key，便于大数据渲染时的性能优化。在使用 reserve-selection, reserve-expand 功能的情况下，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，同时支持 user.info[0].id',
        optional: [],
      },
      {
        name: 'show-overflow-tooltip',
        type: 'Boolean|IOverflowTooltip',
        default: 'false',
        desc: '表格cell内容超长时，是否自动展示tooltip，默认值为false，可以通过设置为true开启，如果需要自定义content请设置为对象，具体参考 IOverflowTooltip（此处配置整个table都启用，单个column配置可覆盖）',
        optional: [],
      },
      {
        name: 'selection-key',
        type: 'string',
        default: '',
        desc: '仅对设置了selection的情况下生效, 用于初始化或者更新row已选中状态,内部使用逻辑为：row[selectionKey]，可以为多级选择，但是多级选择只支持 row.child.child，更多请参考lodash.get',
        optional: [],
      },
      {
        name: 'checked',
        type: 'Array',
        default: '[]',
        desc: `* 默认选中行
      * 仅对设置了selection的情况下生效
      * 值可以为 [key1, key2, key3, ...] 或者 [row1, row2, row3, ...]
      * 如果设置为key，则 selectionKey 必须设置，内部匹配逻辑为：row[selectionKey] === key`,
        optional: [],
      },
      {
        name: 'is-selected-fn',
        type: 'Function',
        default: 'undefined',
        desc: '提供自定义判定当前行是否选中, 如果设置了此属性，其他判定均不生效, ({ row, index, isSelectAll }) => bool',
        optional: [],
      },
      {
        name: 'async-data',
        type: 'Boolean',
        default: 'false',
        desc: '为避免不必要的数据修改导致的不可控组件更新,默认组件不会对传入组件的data进行任何修改,设置此属性为true则会对源数据进行同步（如：启用selection，勾选时想要自动同步到源数据）, 目前只会对指定了selectionKey的情况下才会对指定的字段数据进行更新，同时需要指定 rowKey，保证匹配到的row是正确的目标对象',
        optional: ['true', 'false'],
      },
      {
        name: 'row-hover',
        type: 'String',
        default: 'highlight',
        desc: '鼠标划过行样式行为,配置`highlight`会高亮当前行，`auto`自行设置样式',
        optional: ['highlight', 'auto'],
      },
      {
        name: 'default-sort',
        type: 'Object',
        default: '{}',
        desc: '如果只指定了 prop, 没有指定 order, 则默认顺序是 asc, 配置格式：{ column: order }',
        optional: [],
      },
      {
        name: 'is-row-select-enable',
        type: 'Function|Boolean',
        default: 'true',
        desc: '   * 配合 column selection 使用用于配置渲染行数据的勾选框是否可用, 可以直接为 true|false，全部启用或者禁用如果是函数，则返回 true|false({ row, index, isCheckAll }) => boolean; isCheckAll: 标识全选checkbox是否勾选中',
        optional: [],
      },
      {
        name: 'resizer-way',
        type: 'String',
        default: 'true',
        desc: '当外层容器尺寸改变时，当前组件用什么方式进行重新计算,默认为 throttle，按照指定频率重新计算,可选值：debounce，在指定时间范围内只执行一次重新计算',
        optional: ['throttle', 'debounce'],
      },
      {
        name: 'pagination-heihgt',
        type: 'Number',
        default: '42',
        desc: '页组件高度。在设置了分页配置之后才会生效, 用于配置分页组件的高度，在不同项目中，分页组件高度会影响表格高度计算, 这里设置为可配置项，避免自计算导致的性能问题以及不确定性样式问题',
        optional: [],
      },
      {
        name: 'prepend-style',
        type: 'CSSProperties',
        default: '{}',
        desc: '   * 插入至表格第一行之前的内容容器样式，默认样式为固定在第一行，需要跟随滚动或者其他样式，可以通过此配置进行覆盖',
        optional: [],
      },
      { name: 'stripe', type: 'Boolean', default: 'false', desc: '是否为斑马纹 Table', optional: [] },
      {
        name: 'col-sort-behavior',
        type: 'string',
        default: 'independent',
        desc: ` * 列排序行为
      * independent：列与列之间的排序是独立的，互斥的
      * interdependent：列排序是相互影响、依赖的`,
        optional: ['independent', 'interdependent'],
      },
      {
        name: 'row-draggable',
        type: 'Boolean | Function | Object',
        default: 'false',
        desc: `开启行拖拽排序功能；
        设置true，渲染默认排序样式；
        设置 (row, column, index, rows) => JSX.Element, 自定义拖拽单元格，
        设置对象，参考 IDraggableRowOption，可以设置显示label，fontSize，icon，render
        `,
        optional: [],
      },
      {
        name: 'sort-val-format',
        type: 'Array[]',
        default: '[]',
        desc: `* 排序时对需要排序的字符串数值进行格式化
        * 这里需要配置为正则或者回调函数，(str) => string | number | boolean
        * 如果配置为正则，程序会提取匹配到的第一个结果尝试转换为数值, 正则必须包含分组,例如 /(\d+)%/会提取到第一个结果并尝试转换为数字
        * 如果为多个，程序会顺序执行所有正则表达式，直到转换成功`,
        optional: [],
      },
      {
        name: 'shift-multi-checked',
        type: 'Boolean',
        default: 'false',
        desc: '是否开启shift键多选功能',
        optional: [],
      },
      {
        name: 'scrollbar',
        type: 'Boolean',
        default: 'true',
        desc: '是否启用自定义滚动条，默认开启自定义滚动条，实现不同环境下面一致的用户体验, 注意：如果禁用，会自动启用系统默认滚动条，表格会有8px的占位，以防止滚动条出现时内容出现抖动, 可以通过样式覆盖设置 overflow: auto; 实现按需展示',
        optional: [],
      },

      {
        name: 'fixed-bottom',
        type: 'FixedBottomOption | null',
        default: 'null',
        desc: '固定在底部的配置项',
        optional: [
          ` {
          position: 'absolute' | 'relative';
          height: number;
          loading?: boolean;
        }`,
        ],
      },
    ],
  },
  {
    title: 'IColumn',
    subTile: '列配置详细说明',
    config: [
      {
        name: 'label',
        type: 'String|Function',
        default: '--',
        desc: '显示的标题，可以是字符串或者函数，函数的话需要返回一个String类型字符串',
        optional: [],
      },
      {
        name: 'field',
        type: 'String|Function',
        default: '',
        desc: '绑定的展示字段，可以是字符串或者函数，函数的话需要返回一个存在的字段名称',
        optional: [],
      },
      {
        name: 'prop',
        type: 'String|Function',
        default: '',
        desc: '此属性只在<bk-column>模板绑定时才会生效，如果是函数式绑定请使用`field`. 绑定的展示字段，可以是字符串或者函数，函数的话需要返回一个存在的字段名称',
        optional: [],
      },
      { name: 'render', type: 'String|Function', default: '--', desc: '自定义当前列渲染函数', optional: [] },
      { name: 'width', type: 'Number|String', default: 'auto', desc: '对应列的宽度', optional: [] },
      {
        name: 'minWidth',
        type: 'Number|String',
        default: 'auto',
        desc: '对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列',
        optional: [],
      },
      {
        name: 'showOverflowTooltip',
        type: 'Boolean|IOverflowTooltip',
        default: 'false',
        desc: '表格cell内容超长时，是否自动展示tooltip，默认值为false，可以通过设置为true开启，如果需要自定义content请设置为对象，具体参考 IOverflowTooltip',
        optional: [],
      },
      {
        name: 'type',
        type: 'String',
        default: 'none',
        desc: '对应列的类型。如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮',
        optional: ['index', 'selection', 'expand', 'none'],
      },
      { name: 'resizable', type: 'Boolean', default: 'true', desc: '对应列是否可以通过拖动改变宽度', optional: [] },
      {
        name: 'fixed',
        type: 'String',
        default: 'false',
        desc: '列是否固定在左侧或者右侧，true 表示固定在左侧',
        optional: ['left', 'right'],
      },
      {
        name: 'sort',
        type: 'Boolean|ISort|String',
        default: 'false',
        desc: '对应列是否可以排序，可以简单设置true开启默认排序，也可以通过详细配置排序方式，请参考ISort',
        optional: [],
      },
      {
        name: 'filter',
        type: 'Boolean|String|IFilter',
        default: 'false',
        desc: '数据过滤的选项,可以简单设置true开启默认过滤。可以通过详细配置排序方式，请参考IFilter',
        optional: [],
      },
      {
        name: 'colspan',
        type: 'Number|Function',
        default: 1,
        desc: '规定单元格可横跨的列数,数值类型或者函数：({ column, colIndex, row, rowIndex }) => number',
        optional: [],
      },
      {
        name: 'rowspan',
        type: 'Number|Function',
        default: 1,
        desc: '规定单元格可横跨的行数,数值类型或者函数：({ column, colIndex, row, rowIndex }) => number',
        optional: [],
      },
      { name: 'index', type: 'Number', default: undefined, desc: '自定义表格列所在排序', optional: [] },
      { name: 'align', type: 'left|center|right|""', default: '--', desc: '列齐方式', optional: [] },
      {
        name: 'explain',
        type: 'Boolean | IColumnExplain',
        default: 'false',
        desc: '解释说明: 当表格中的字段或数据需要做解释说明时，可增加 [下划线] 提示，hover 可查看解释说明的 tooltips',
        optional: [],
      },
      {
        name: 'children',
        type: 'IColumn[]',
        default: '[]',
        desc: '嵌套实现多表头，如果是多表头分组，可以只设置 label 属性',
        optional: [],
      },
    ],
  },
  {
    title: 'IColumnExplain',
    subTile: 'Table Column IColumnExplain config',
    config: [
      {
        name: 'content',
        type: 'String|Function',
        default: 'Cell innerText',
        desc: '当表格中的字段或数据需要做解释说明时，hover 可查看解释说明的 tooltips content',
        optional: [],
      },
      {
        name: 'head',
        type: 'Boolean|String|Function',
        default: 'Cell innerHTML',
        desc: '当表格中Head需要做解释说明时, hover 可查看解释说明的 tooltips content',
        optional: [],
      },
    ],
  },
  {
    title: 'IDraggableRowOption',
    subTile: 'Table Row Draggable Config',
    config: [
      {
        name: 'label',
        type: 'String|Function',
        default: '排序',
        desc: '拖拽列表头显示内容，可以是文本或者回调函数',
        optional: [],
      },
      { name: 'render', type: 'Function', default: '--', desc: '表格拖拽行首列单元格渲染函数', optional: [] },
      { name: 'fontSize', type: 'String', default: '14px', desc: '拖拽单元格字体大小', optional: [] },
      { name: 'width', type: 'number', default: '60px', desc: '拖拽排序列宽度设置', optional: [] },
    ],
  },
  {
    title: 'IOverflowTooltip',
    subTile:
      'Table Cell ellipsis tooltip config, 此配置是可以继承的，table上面配置项会默认应用到所有Column， Column如有需要只需要修改差异配置即可。同样的配置Column上面的配置优先级会高于Table上面配置',
    config: [
      {
        name: 'allowHtml',
        type: 'Boolean',
        default: 'false',
        desc: '默认是否显示cell.innerHTML',
        optional: ['true', 'false'],
      },
      {
        name: 'content',
        type: 'String|Function',
        default: 'Cell innerText',
        desc: 'tooltip展示内容，可以为回调函数，回调参数 (column, row) => string',
        optional: [],
      },
      { name: 'disabled', type: 'Boolean', default: 'false', desc: '是否展示tooltip', optional: ['true', 'false'] },
      {
        name: 'mode',
        type: 'String',
        default: 'auto',
        desc: '渲染模式，可选项 auto|static, auto模式会自动计算文本宽度和表格单元宽度，只有当文本宽度超出tip才会激活，如果是static模式，则会一直激活状态',
        optional: ['auto', 'static'],
      },
      {
        name: 'watchCellResize',
        type: 'Boolean',
        default: 'true',
        desc: '是否监听当前cell尺寸变化, 动态添加tooltip, 【如果需要提升性能，请禁用此功能】',
        optional: ['true', 'false'],
      },
      {
        name: 'popoverOption',
        type: 'Object',
        default: '{}',
        desc: '文本溢出弹出popover配置，具体可参考 popover组件配置项',
        optional: [],
      },
    ],
  },
  {
    title: 'IHead',
    subTile: '表头详细配置说明',
    config: [
      { name: 'height', type: 'Number', default: 'LINE_HEIGHT', desc: 'Thead行高，可以为固定数值类型', optional: [] },
      {
        name: 'color',
        type: 'string',
        default: 'IHeadColor.DEF1',
        desc: '根据表格的使用场景，表头支持颜色自定义，默认提供的选项：def1: #FAFBFD、def2: #F0F1F5，尽量一个项目选用同一种颜色。支持自定义颜色，可传入自定义颜色值',
        optional: ['def1', 'def2'],
      },
      { name: 'isShow', type: 'Boolean', default: 'true', desc: '是否显示Head', optional: [] },
      { name: 'cellFn', type: 'Function', default: 'undefined', desc: '自定义当前列渲染函数', optional: [] },
    ],
  },
  {
    title: 'ISort',
    subTile: '排序详细配置',
    config: [
      { name: 'value', type: 'string', default: 'asc', desc: '排序规则', optional: ['asc', 'desc'] },
      {
        name: 'sortFn',
        type: 'Function',
        default: '--',
        desc: '自定义排序函数(a,b,type) => number，type 值 `asc, desc, null`，函数参考 Array.sort((a,b) => number)',
        optional: [],
      },
      {
        name: 'sortScope',
        type: 'String',
        default: 'current',
        desc: '排序生效范围，针对分页表格，当前排序是当前页生效还是全部数据排序',
        optional: ['current', 'all'],
      },
    ],
  },
  {
    title: 'IFilter',
    subTile: '过滤详细配置',
    config: [
      {
        name: 'filterFn',
        type: 'Function',
        default: '--',
        desc: '自定义过滤函数，参数：(checked, row, props.column, index, data) => boolean。如果要使用远程过滤，为防止默认过滤，请配置此选项为: () => true',
        optional: [],
      },
      {
        name: 'list',
        type: 'Array[{ value, text }]',
        default: '[]',
        desc: '数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。',
        optional: [],
      },
      { name: 'checked', type: 'String[]||Number[]||Boolean[]', default: '[]', desc: '筛选项选中的元素', optional: [] },
      {
        name: 'match',
        type: 'String',
        default: 'full',
        desc: '过滤匹配模式，默认全量匹配',
        optional: ['full', 'fuzzy'],
      },
      {
        name: 'filterScope',
        type: 'String',
        default: 'current',
        desc: '如果有分页，配置过滤范围为当前页面或者跨页',
        optional: ['current', 'all'],
      },
      {
        name: 'maxHeight',
        type: 'Number||String',
        default: '--',
        desc: '设置下拉框滚动列表的最大高度，默认15行',
        optional: [],
      },
      {
        name: 'height',
        type: 'Number||String',
        default: '--',
        desc: '设置下拉框滚动列表的高度（不推荐设置）',
        optional: [],
      },
      {
        name: 'btnSave',
        type: 'String|Boolean',
        default: '确定',
        desc: '数据过滤的`确定`按钮配置，可配置为String类型，配置不同显示文本；也可以配置为false，禁用确定按钮，当此按钮禁用，单击过滤选项即生效',
        optional: [],
      },
      {
        name: 'btnReset',
        type: 'String|Boolean',
        default: '重置',
        desc: '数据过滤的`重置`按钮配置，可配置为String类型，配置不同显示文本；也可以配置为false，禁用`重置`按钮',
        optional: [],
      },
    ],
  },
  {
    title: 'ISettings',
    subTile: '表格设置详细配置，default：large: 78，medium: 60，small: 42',
    config: [
      { name: 'fields', type: 'Field[]', default: '--', desc: '可选的字段列表', optional: [] },
      { name: 'checked', type: 'String[]', default: '[]', desc: '已选的字段列表', optional: [] },
      {
        name: 'limit',
        type: 'Number',
        default: '0',
        desc: '配置最多能选择多少个字段，配置该属性后，字段列表将不提供全选功能',
        optional: [],
      },
      {
        name: 'size',
        type: 'String',
        default: 'small',
        desc: '当前表格的尺寸',
        optional: ['small', 'medium', 'large'],
      },
      {
        name: 'sizeList',
        type: 'Array[{ value, label, height }]',
        default: '[]',
        desc: '自定义表格尺寸列表',
        optional: [],
      },
      {
        name: 'extCls',
        type: 'string',
        default: '',
        desc: '表格设置弹出框自定义className，会追加到弹出元素外层，方便自定义样式',
        optional: [],
      },
      {
        name: 'trigger',
        type: 'String',
        default: 'manual',
        desc: '表格设置弹出触发类型, "manual, 默认设置，需要手动关闭", "click, 点击弹出，点击设置弹出窗之外的元素关闭弹出", "click, 鼠标滑入弹出，鼠标滑入弹出窗之外的元素关闭弹出"',
        optional: ['manual', 'click', 'hover'],
      },
    ],
  },
  {
    title: 'Events',
    subTile: '表格事件',
    type: 'events',
    config: [
      { name: 'row-click', desc: '当某一行被点击时会触发该事件', params: '(event, row, index, rows)' },
      { name: 'row-dblclick', desc: '当某一行被双击时会触发该事件', params: '(event, row, index, rows)' },
      {
        name: 'cell-click',
        desc: '当表格单元格被点击时会触发该事件, cell 提供`getValue`方法，用于获取当前单元格内容',
        params: '{event, row, cell, column, rowIndex, columnIndex}',
      },
      {
        name: 'cell-dblclick',
        desc: '当表格单元格被双击时会触发该事件, cell 提供`getValue`方法，用于获取当前单元格内容',
        params: '{event, row, cell, column, rowIndex, columnIndex}',
      },
      {
        name: 'row-expand',
        desc: '当用户对某一行展开或者关闭的时候会触发该事件',
        params: '{ row, column, index, rows, e }',
      },
      { name: 'row-mouse-enter', desc: '行鼠标进入', params: 'e, row, index, rows' },
      { name: 'row-mouse-leave', desc: '行鼠标离开', params: 'e, row, index, rows' },
      { name: 'page-limit-change', desc: '当用户切换表格每页显示条数时会出发的事件', params: 'limit' },
      { name: 'page-value-change', desc: '当用户切换表格分页时会触发的事件', params: 'current' },
      { name: 'scroll-bottom', desc: '滚动到底部触发事件', params: '{ bottom, translateX, translateY }' },
      { name: 'setting-change', desc: '表格设置发生变化时的事件', params: '{ checked, size, height }' },
      { name: 'column-sort', desc: '当表格的排序条件发生变化的时候会触发该事件', params: '{ column, index, type }' },
      {
        name: 'column-filter',
        desc: '当表格的筛选条件发生变化的时候会触发该事件',
        params: '{ checked, column, index }',
      },
      { name: 'column-pick', desc: '当表格的选中一列的时候会触发该事件,(prop column-pick启用)', params: 'column[]' },
      { name: 'select-all', desc: '当用户手动勾选全选 Checkbox 时触发的事件', params: '{ checked, data }' },
      {
        name: 'select',
        desc: '当用户手动勾选数据行的 Checkbox 时触发的事件，此事件等同于`selection-change`事件',
        params: '{ row, index, checked, data }',
      },
      {
        name: 'selection-change',
        desc: '当行选择项发生变化时会触发该事件，全选操作不会触发此事件，全选操作请监听`select-all`事件',
        params: '{ row, index, checked, data }',
      },
    ],
  },
  {
    title: 'Methods',
    subTile: 'bk-table 方法',
    type: 'events',
    config: [
      { name: 'clearSelection', desc: '用于多选表格，清空用户的选择', params: '' },
      { name: 'getSelection', desc: '用于多选表格，获取用户的选择', params: '' },
      {
        name: 'toggleRowSelection',
        desc: '用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）',
        params: 'row, selected',
      },
      { name: 'toggleAllSelection', desc: '用于多选表格，切换所有行的选中状态', params: '' },
      { name: 'scrollTo', desc: '指定滚动位置', params: '({ left = 0, top = 0 })' },
      {
        name: 'setRowExpand',
        desc: '用于可展开表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）',
        params: 'row, expanded',
      },
      {
        name: 'setAllRowExpand',
        desc: '用于可展开表格，切换当前页所有展开状态，参数设置展开与否（expanded 为 true 则展开）',
        params: 'expanded',
      },
    ],
  },
  {
    title: 'Slots',
    subTile: '预留插槽',
    type: 'events',
    config: [
      { name: '#prepend', desc: '插入至表格第一行之前的内容，会被固定在第一行', params: '' },
      { name: '#expandRow', desc: '展开收起一行', params: 'row' },
      { name: '#expandCell', desc: '自定义展开收起单元格', params: '{ row, column, index, rows }' },
      { name: '#expandContent', desc: '自定义展开收起单元格内容（展开收起ICON内置）', params: '{ row }' },
      { name: '#empty', desc: '自定义空数据-empty插槽', params: '' },
      {
        name: '#default',
        desc: '<bk-column />模板使用自定义显示默认插槽, 这里面参数 data & row 在使用时要注意，data是原始数据，在组件中没有被代理监听，这个数据主要是回传给调用方使用，例如接口调用；如果要绑定数据实现实时更新请使用 row，row是组件内被监听数据，包含一些组件内置属性和方法',
        params: '{ cell, data, row, column, index, rows }',
      },
      {
        name: '#fixedBottom',
        desc: '底部加载插槽,此插槽内容会一直固定在底部, 可以结合 props.fixedBottom 进行详细配置',
        params: '',
      },
      { name: '#setting', desc: '表格设置中间自定义插槽', params: '' },
    ],
  },
  {
    title: 'Q & A',
    subTile: '常见问题汇总',
    type: 'QA',
    config: [
      {
        name: '使用自定义渲染 render | <bk-column /> slot 数据不更新',
        desc: '在插槽或者render函数渲染中，请检查自定义渲染使用的是否是 data，data 是列表原始数据，组件内没有做代理监听，不会进行双向数据更新，提供此属性主要是有些场景需要使用原始数据进行操作，这里请用row进行数据绑定',
      },
      {
        name: '使用插槽 #expandRow没显示展开收起操作列',
        desc: '展开收起操作列需要手动添加到，增加一列配置，<column type="expand"></column>，只有增加此配置，才会渲染',
      },
      {
        name: '数据不更新，没有使用自定义渲染',
        desc: '建议设置table.rowKey, 默认不设置rowKey时，表格会根据数据变化自动更新,设置rowKey后组件会在传递的数据中每行查找对应的数据作为key值，设置到table tr上面，当数据行变化时会被监听并更新',
      },
      {
        name: '每列最小宽度问题',
        desc: '表格列有设置默认宽度 COL_MIN_WIDTH = 30，可以通过 column.minWidth修正，具体参考 column min-width 设置',
      },
      { name: '如何自定义Head颜色', desc: '通过 thead.color 可以改变颜色设置，详情可参考 IThead 设置' },
      {
        name: '如何自定义Head VNode',
        desc: '有两种方式可以自定义Head，Column.label支持函数返回VNode，针对单独列可以选择此方式进行自定义渲染，也可以通过 `thead.cellFn` 渲染head，此时是针对全部列，需要自行判定，如果同时设置了 `thead.cellFn` 和 `column.label`都为渲染函数，`thead.cellFn`优先级更高，会覆盖column.label设置',
      },
    ],
  },
];

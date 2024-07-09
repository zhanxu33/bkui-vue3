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
import { h, isVNode, nextTick } from 'vue';

import Checkbox from '@bkui-vue/checkbox';
import { usePrefix } from '@bkui-vue/config-provider';
import { DownShape, Folder, FolderShapeOpen, RightShape, Spinner, TextFile } from '@bkui-vue/icon';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import { TreeNode, TreePropTypes } from './props';
import useNodeAsync from './use-node-async';
import useNodeAttribute from './use-node-attribute';
import {
  getLabel,
  getNodeItemClass,
  getNodeItemStyle,
  getNodeRowClass,
  IFlatData,
  resolveNodeItem,
  showCheckbox,
} from './util';
export default (props: TreePropTypes, ctx, flatData: IFlatData, _renderData, initOption) => {
  // const checkedNodes = [];
  let selectedNodeId = props.selected;
  const {
    setNodeAttr,
    setNodeAttrById,
    getNodePath,
    getSchemaVal,
    getNodeAttr,
    getNodeId,
    getChildNodes,
    isRootNode,
    hasChildNode,
    isItemOpen,
    isNodeOpened,
    isNodeLoading,
    isNodeChecked,
    getParentNode,
    resolveScopedSlotParam,
    extendNodeAttr,
    extendNodeScopedData,
  } = useNodeAttribute(flatData, props);

  const { resolveClassName } = usePrefix();

  const { registerNextLoop } = initOption;

  const { asyncNodeClick, deepAutoOpen } = useNodeAsync(props, flatData);

  /**
   * 根据当前节点状态获取节点类型Icon
   * @param item
   * @returns
   */
  const getRootIcon = (item: TreeNode) =>
    isItemOpen(item) ? (
      <FolderShapeOpen class={[resolveClassName('tree-icon'), resolveClassName('node-prefix')]} />
    ) : (
      <Folder class={[resolveClassName('tree-icon'), resolveClassName('node-prefix')]} />
    );

  /**
   * 渲染动态设置的节点样式
   * @param val
   * @returns
   */
  const renderPrefixVal = (
    val: { node: string; className: string; text: boolean | number | string; style: Record<string, string> } | string,
  ) => {
    if (typeof val === 'string') {
      return val;
    }

    if (typeof val === 'object' && val !== null) {
      if (isVNode(val)) {
        return val;
      }
      const { node, className, text, style } = val;
      return h(node, { class: className, style }, text as boolean | number | string);
    }

    return null;
  };

  const getLoadingIcon = (item: TreeNode) =>
    ctx.slots.nodeLoading?.(getScopedSlotData(item)) ?? isNodeLoading(item) ? <Spinner></Spinner> : '';

  /**
   * 根据节点状态获取节点操作Icon
   * @param item
   * @returns
   */
  const getActionIcon = (item: TreeNode) => {
    if (ctx.slots.nodeAction) {
      return ctx.slots.nodeAction(getScopedSlotData(item));
    }

    let prefixFnVal = null;

    if (isNodeLoading(item)) {
      return getLoadingIcon(item);
    }

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(getScopedSlotData(item), 'node_action');
      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      const autoCheckChild =
        typeof props.autoCheckChildren === 'function' ? props.autoCheckChildren(item) : props.autoCheckChildren;

      if (hasChildNode(item) || item.async || !autoCheckChild) {
        return isItemOpen(item) ? (
          <DownShape class={resolveClassName('node-prefix')} />
        ) : (
          <RightShape class={resolveClassName('node-prefix')} />
        );
      }
    }

    return null;
  };

  /**
   * 获取节点类型Icon
   * @param item
   * @returns
   */
  const getNodePrefixIcon = (item: TreeNode) => {
    if (!props.showNodeTypeIcon) {
      return null;
    }

    if (ctx.slots.nodeType) {
      return ctx.slots.nodeType(getScopedSlotData(item));
    }

    let prefixFnVal = null;

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(getScopedSlotData(item), 'node_type');

      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      return isRootNode(item) || hasChildNode(item) ? (
        getRootIcon(item)
      ) : (
        <TextFile class={[resolveClassName('tree-icon'), resolveClassName('node-prefix')]} />
      );
    }

    return null;
  };

  const updateParentChecked = (item: TreeNode, isChecked) => {
    const parent = getParentNode(item);
    if (parent) {
      const isNeedChecked = isChecked
        ? isChecked
        : (getChildNodes(parent) || []).some((node: TreeNode) => isNodeChecked(node));

      setNodeAttr(parent, NODE_ATTRIBUTES.IS_CHECKED, isNeedChecked);

      setNodeAttr(
        parent,
        NODE_ATTRIBUTES.IS_INDETERMINATE,
        (getChildNodes(parent) || []).some((node: TreeNode) => !isNodeChecked(node) || isIndeterminate(node)),
      );

      if (!isRootNode(parent)) {
        updateParentChecked(parent, isChecked);
      }
    }
  };

  const deepUpdateChildNode = (node: TreeNode, attr: string | string[], value: unknown | unknown[]) => {
    getChildNodes(node).forEach(chid => {
      if (Array.isArray(attr)) {
        attr.forEach((val, index) => {
          setNodeAttr(chid, val, value[index]);
        });
      } else {
        setNodeAttr(chid, attr, value);
      }

      deepUpdateChildNode(chid, attr, value);
    });
  };

  const handleNodeItemCheckboxChange = (item: TreeNode, value: boolean, event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    setNodeAttr(item, NODE_ATTRIBUTES.IS_CHECKED, !!value);
    if (value) {
      setNodeAttr(item, NODE_ATTRIBUTES.IS_INDETERMINATE, false);
    }

    if (props.checkStrictly) {
      deepUpdateChildNode(item, [NODE_ATTRIBUTES.IS_CHECKED, NODE_ATTRIBUTES.IS_INDETERMINATE], [!!value, false]);
    }

    updateParentChecked(item, value);
    ctx.emit(
      EVENTS.NODE_CHECKED,
      flatData.data.filter((t: TreeNode) => isNodeChecked(t)),
      flatData.data.filter((t: TreeNode) => isIndeterminate(t)),
    );

    handleNodeContentClick(item, event as MouseEvent);
  };

  const isIndeterminate = (item: TreeNode) =>
    isNodeChecked(item) && getNodeAttr(item, NODE_ATTRIBUTES.IS_INDETERMINATE);

  const getCheckboxRender = (item: TreeNode) => {
    if (!showCheckbox(props, extendNodeScopedData(item))) {
      return null;
    }

    return (
      <span onClick={handleNodeCheckboxClick}>
        <Checkbox
          indeterminate={isIndeterminate(item)}
          modelValue={isNodeChecked(item)}
          size='small'
          onChange={(val, event) => handleNodeItemCheckboxChange(item, !!val, event)}
        ></Checkbox>
      </span>
    );
  };

  /**
   * 设置指定节点是否展开
   * @param item
   * @param isOpen
   */
  const setNodeOpened = (item: TreeNode, isOpen = null, e: MouseEvent = null, fireEmit = true) => {
    const newVal = isOpen === null ? !isItemOpen(item) : !!isOpen;

    /**
     * 在收起节点时需要重置当前节点的所有叶子节点状态为 __isOpen = false
     * 如果是需要点击当前节点展开所有叶子节点此处也可以打开
     */
    if (!newVal) {
      deepUpdateChildNode(item, NODE_ATTRIBUTES.IS_OPEN, newVal);
    }

    setNodeAttr(item, NODE_ATTRIBUTES.IS_OPEN, newVal);

    if (fireEmit) {
      const emitEvent: string = isItemOpen(item) ? EVENTS.NODE_EXPAND : EVENTS.NODE_COLLAPSE;
      ctx.emit(emitEvent, item, resolveScopedSlotParam(item), getSchemaVal(item), e);
    }
  };

  /**
   * 设置指定节点行为 checked isOpen
   * @param args
   * @param action
   * @param value
   * @returns
   */
  const setNodeAction = (args: TreeNode | TreeNode[], action: string, value: unknown) => {
    if (Array.isArray(args)) {
      args.forEach((node: TreeNode) => setNodeAttr(resolveNodeItem(node), action, value));
      return;
    }

    setNodeAttr(resolveNodeItem(args), action, value);
  };

  /**
   * 指定节点展开
   * @param item 节点数据 | Node Id
   * @param isOpen 是否展开
   * @param autoOpenParents 如果是 isOpen = true，是否自动设置所有父级展开
   * @returns
   */
  const setOpen = (item: TreeNode, isOpen = true, autoOpenParents = false) => {
    setNodeAttribute(item, NODE_ATTRIBUTES.IS_OPEN, isOpen, autoOpenParents && isOpen);
  };

  /**
   * 递归处理当前节点以及父级节点属性值
   * @param node 指定节点
   * @param attrName 属性名称
   * @param value 属性值
   * @param loopParent 是否需要递归更新父级
   */
  const setNodeAttribute = (
    node: TreeNode,
    attrName: string | string[],
    value: (boolean | number | string)[] | boolean | number | string,
    loopParent = false,
  ) => {
    const resolvedItem = resolveNodeItem(node);
    if (resolvedItem[NODE_ATTRIBUTES.IS_NULL]) {
      return;
    }

    const attrNames = Array.isArray(attrName) ? attrName : [attrName];
    const values = Array.isArray(value) ? value : [value];

    if (loopParent) {
      attrNames.forEach((name, index) => setNodeAction(resolvedItem, name, values[index]));

      if (!isRootNode(resolvedItem)) {
        const parent = getParentNode(resolvedItem);
        attrNames.forEach((name, index) => {
          const parentVal = getNodeAttr(parent, name);
          if (parentVal !== value) {
            setNodeAttribute(parent, name, values[index], loopParent);
          }
        });
      }
    } else {
      attrNames.forEach((name, index) => setNodeAction(resolvedItem, name, values[index]));
    }
  };

  /**
   * 节点点击
   * @param item
   */
  const handleTreeNodeClick = (item: TreeNode, e: MouseEvent) => {
    const isOpen = isItemOpen(item);
    if (isOpen) {
      setNodeOpened(item, false, e, true);
      return;
    }

    /** 如果是异步请求加载 */
    asyncNodeClick(item).finally(() => {
      if (getNodeAttr(item, NODE_ATTRIBUTES.IS_LOADING)) {
        registerNextLoop('setNodeOpenedAfterLoading', {
          type: 'once',
          fn: () => setNodeOpened(item, true, e, true),
        });
      } else {
        setNodeOpened(item, true, e, true);
      }
    });
  };

  /**
   * 点击树形节点展开、收起图标处理事件
   * @param e 鼠标事件
   * @param node 当前节点
   */
  const handleNodeActionClick = (e: MouseEvent, node: TreeNode) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    handleTreeNodeClick(node, e);
  };

  const setSelect = (nodes: TreeNode | TreeNode[], selected = true, autoOpen = true) => {
    const nodeList = Array.isArray(nodes) ? nodes : [nodes];
    if (!nodeList.length) {
      return;
    }

    let resolvedItem = resolveNodeItem(nodeList[0]);
    if (typeof resolvedItem === 'string' || typeof resolvedItem === 'number' || typeof resolvedItem === 'symbol') {
      resolvedItem = flatData.data.find(item => getNodeId(item) === resolvedItem) ?? {
        [NODE_ATTRIBUTES.IS_NULL]: true,
      };
    }

    if (resolvedItem[NODE_ATTRIBUTES.IS_NULL]) {
      return;
    }

    if (
      !props.selectable ||
      (typeof props.selectable === 'function' && !props.selectable(nodes)) ||
      (props.disabledFolderSelectable && resolvedItem.is_folder === true)
    ) {
      console.warn('props.selectable is false or undefined, please set selectable with true');
      return;
    }
    if (selectedNodeId !== null && selectedNodeId !== undefined) {
      setNodeAttrById(selectedNodeId, NODE_ATTRIBUTES.IS_SELECTED, !selected);
    }

    if (props.selected && props.selected !== selectedNodeId) {
      setNodeAttrById(props.selected, NODE_ATTRIBUTES.IS_SELECTED, !selected);
    }

    setNodeAttr(resolvedItem, NODE_ATTRIBUTES.IS_SELECTED, selected);
    selectedNodeId = getNodeId(resolvedItem);

    /**
     * 如果设置了自动展开
     * 判定长度是为了处理异步节点,如果当前设置selected的节点为多级异步节点
     * 此时需要一层一层展开所有数据，只需要在最后一次执行setOpen即可
     */
    if (autoOpen && nodeList.length === 1) {
      setOpen(resolvedItem, true, true);
    }

    /**
     * 处理异步节点多层级展开选中
     */
    if (getNodeAttr(resolvedItem, NODE_ATTRIBUTES.IS_ASYNC)) {
      asyncNodeClick(resolvedItem).then(() => {
        nextTick(() => {
          nodeList.shift();
          setSelect(nodeList, selected, autoOpen);
        });
      });
    }
  };

  const resolveNodeAction = (node: TreeNode): string[] => {
    if (typeof props.nodeContentAction === 'function') {
      return Reflect.apply(props.nodeContentAction, this, [{ node }]);
    }

    if (typeof props.nodeContentAction === 'string') {
      return [props.nodeContentAction];
    }

    if (Array.isArray(props.nodeContentAction)) {
      return props.nodeContentAction;
    }

    return ['selected', 'expand', 'click'];
  };

  /**
   * 点击节点事件
   * @param item
   */
  const handleNodeContentClick = (item: TreeNode, e: MouseEvent) => {
    const nodeActions = resolveNodeAction(item);
    if (nodeActions.includes('selected')) {
      setSelect(item, true, false);
    }

    if (nodeActions.includes('expand')) {
      if (!isNodeOpened(item)) {
        handleTreeNodeClick(item, e);
      }
    }

    if (nodeActions.includes('collapse')) {
      if (isNodeOpened(item)) {
        handleTreeNodeClick(item, e);
      }
    }

    if (nodeActions.includes('click')) {
      const eventName: string = EVENTS.NODE_CLICK;
      ctx.emit(eventName, item, resolveScopedSlotParam(item), getSchemaVal(item), e);
    }
  };

  /**
   * 用于判定当前节点需要展示的连线
   * 当前指定的depth需不需要展示连线
   * @param depth 当前需要判定的depth
   * @param node 当前节点
   * @returns
   */
  const filterNextNode = (depth: number, node: TreeNode) => {
    if (isRootNode(node)) {
      return false;
    }

    const nodepath = getNodePath(node);
    const paths = `${nodepath}`.split('-').slice(0, depth + 1);
    const currentPath = paths.join('-');

    // 如果是判定当前节点，则必须要有一条线
    if (currentPath === nodepath) {
      return true;
    }

    const lastLevel = paths.pop();
    const nextLevel = parseInt(lastLevel, 10);
    paths.push(`${nextLevel + 1}`);
    const nextNodePath = paths.join('-');
    return flatData.data.some((val: TreeNode) => getNodePath(val) === nextNodePath);
  };

  /**
   * 获取层级连线
   * @param node 节点
   * @returns
   */
  const getVirtualLines = (node: TreeNode) => {
    if (!props.levelLine) {
      return null;
    }

    const getNodeLineStyle = (dpth: number) => ({
      '--depth': dpth,
    });

    const maxDeep = (getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) ?? 0) + 1;
    return (
      new Array(maxDeep)
        .fill('')
        .map((_, index: number) => index)
        .filter((depth: number) => filterNextNode(depth, node))
        .filter((depth: number) => depth > 0)
        // @ts-ignore:next-line
        .map((index: number) => (
          <span
            style={getNodeLineStyle(maxDeep - index)}
            class='node-virtual-line'
          ></span>
        ))
    );
  };

  const renderNodeSlots = (item: TreeNode) => {
    if (ctx.slots.node) {
      return ctx.slots.node?.(getScopedSlotData(item));
    }

    if (ctx.slots.default) {
      return ctx.slots.default?.(extendNodeScopedData(item));
    }

    return [getLabel(item, props)];
  };

  const getScopedSlotData = item => {
    if (props.keepSlotData) {
      return extendNodeScopedData(item);
    }

    return extendNodeAttr(item);
  };

  const handleNodeCheckboxClick = (event: MouseEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
  };

  /**
   * 渲染节点函数
   * @param item 当前节点
   * @param showTree 是否展示为树形结构
   */
  const renderTreeNode = (item: TreeNode, showTree = true) => (
    <div
      key={getNodeId(item)}
      class={getNodeRowClass(item, flatData.schema)}
      data-tree-node={getNodeId(item)}
    >
      <div
        style={getNodeItemStyle(item, props, flatData, showTree)}
        class={getNodeItemClass(item, flatData.schema, props, showTree)}
        onClick={(e: MouseEvent) => handleNodeContentClick(item, e)}
      >
        <div
          class={[resolveClassName('node-action')]}
          onClick={(e: MouseEvent) => handleNodeActionClick(e, item)}
        >
          {getActionIcon(item)}
        </div>
        <div class={resolveClassName('node-content')}>
          {[getCheckboxRender(item), getNodePrefixIcon(item)]}
          <span class={resolveClassName('node-text')}>{renderNodeSlots(item)}</span>
          {ctx.slots.nodeAppend?.(getScopedSlotData(item))}
        </div>
        {showTree && getVirtualLines(item)}
      </div>
    </div>
  );

  return {
    renderTreeNode,
    handleTreeNodeClick,
    deepAutoOpen,
    asyncNodeClick,
    setNodeAction,
    setNodeOpened,
    setSelect,
    setOpen,
    setNodeAttribute,
  };
};

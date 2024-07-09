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

import { isElement } from 'lodash';

import { NODE_ATTRIBUTES, NODE_SOURCE_ATTRS } from './constant';
import { TreeNode, TreePropTypes } from './props';

export default (
  flatData: {
    data: TreeNode[];
    schema: WeakMap<TreeNode, unknown>;
  },
  props?: TreePropTypes,
) => {
  /**
   * 获取Schema中指定的对象值
   * @param key
   * @returns
   */
  const getSchemaVal = (node: TreeNode) => flatData.schema.get(node);

  /**
   * 获取节点属性
   * @param node 当前节点
   * @param attr 节点属性
   * @returns
   */
  const getNodeAttr = (node: TreeNode, attr: string) => getSchemaVal(node)?.[attr];

  /**
   * 设置节点属性
   * @param node 指定节点
   * @param attr 节点属性
   * @param val 属性值
   * @returns
   */
  const setNodeAttr = (node: TreeNode, attr: string, val: unknown, id?) => {
    if (!flatData.schema.has(node)) {
      console.warn('node is not in schema, please check', id, node);
      return;
    }

    flatData.schema.set(node, Object.assign({}, getSchemaVal(node), { [attr]: val }));
  };

  const getNodeById = (id: string | unknown): TreeNode => flatData.data.find(item => getNodeId(item) === id);

  const setNodeAttrById = (id: unknown, attr: string, val: unknown) => {
    if (Array.isArray(id)) {
      Array.prototype.forEach.call(id, (item: TreeNode) => setNodeAttr(getNodeById(item), attr, val, id));
      return;
    }

    setNodeAttr(getNodeById(id), attr, val, id);
  };

  const getNodePath = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.PATH);
  const getNodeId = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.UUID);
  const isNodeOpened = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.IS_OPEN);
  const hasChildNode = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.HAS_CHILD);
  const isNodeMatched = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.IS_MATCH);
  const isNodeChecked = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.IS_CHECKED);
  const getNodeParentId = (node: TreeNode) =>
    getNodeAttr(getNodeAttr(node, NODE_ATTRIBUTES.PARENT), NODE_ATTRIBUTES.UUID);
  const isNodeLoading = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.IS_LOADING);
  const getParentNode = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.PARENT);
  const isMatchedNode = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.IS_MATCH);

  const getNodeAttrById = (id: string, attr: string) => {
    const target = flatData.data.find(item => getNodeId(item) === id);
    return getNodeAttr(target, attr);
  };

  const isRootNode = (node: TreeNode | string) => {
    if (typeof node === 'string') {
      return getNodeAttrById(node, NODE_ATTRIBUTES.IS_ROOT);
    }

    return getNodeAttr(node, NODE_ATTRIBUTES.IS_ROOT);
  };

  const getNodeParentIdById = (id: string) => {
    const target = flatData.data.find(item => getNodeId(item) === id);
    return getNodeParentId(target);
  };

  const getNodePathById = (id: string) => {
    const target = flatData.data.find(item => getNodeId(item) === id);
    return getNodePath(target);
  };

  const setTreeNodeLoading = (node: TreeNode, value: boolean) => {
    setNodeAttr(node, NODE_ATTRIBUTES.IS_LOADING, value);
  };

  // const deleteNodeSchema = (id: string) => (flatData.schema as Map<string, any>).delete(id);

  /**
   * 判定指定节点是否为展开状态
   * @param item 节点或者节点 UUID
   * @returns
   */
  const isItemOpen = (item: TreeNode) => {
    if (typeof item === 'object') {
      return isNodeOpened(item);
    }

    if (typeof item === 'string') {
      return getNodeAttrById(item, NODE_ATTRIBUTES.IS_OPEN);
    }

    return false;
  };

  const getParentNodeAttr = (node: TreeNode, attrName: string) => {
    return getNodeAttr(getNodeAttr(node, NODE_ATTRIBUTES.PARENT), attrName);
  };

  const isParentNodeOpened = (node: TreeNode) => isItemOpen(getNodeAttr(node, NODE_ATTRIBUTES.PARENT));

  /**
   * 过滤当前状态为Open的节点
   * 页面展示只会展示Open的节点
   * @param item
   * @returns
   */
  const checkNodeIsOpen = (node: TreeNode) => isRootNode(node) || isItemOpen(node) || isParentNodeOpened(node);

  /**
   * 根据节点path返回源数据中节点信息
   * @param path
   * @returns
   */
  const getSourceNodeByPath = (path: string, uid?: string) => {
    const paths = path.split('-');

    const target = paths.reduce((pre, nodeIndex: string) => {
      const index = Number(nodeIndex);
      return Array.isArray(pre) ? pre[index] : pre[props.children][index];
    }, props.data);

    if (uid) {
      Object.assign(target, { [NODE_ATTRIBUTES.UUID]: uid });
    }

    return target;
  };

  const getChildNodes = (node: TreeNode) => {
    return (node[props.children] as TreeNode[]) ?? [];
  };

  const getSourceNodeByUID = (uid: string) => flatData.data.find(item => getNodeId(item) === uid);

  const getParentNodeData = (node: TreeNode | string) => {
    if (isRootNode(node)) {
      return { [props.children]: props.data };
    }

    return getParentNode(node as TreeNode);
  };

  /**
   * 处理scoped slot 透传数据
   * @param item 当前节点数据
   * @returns
   */
  const resolveScopedSlotParam = (item: TreeNode) => ({
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_LOADING]]: getNodeAttr(item, NODE_ATTRIBUTES.IS_LOADING),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.HAS_CHILD]]: hasChildNode(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_MATCH]]: isNodeMatched(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_CHECKED]]: isNodeChecked(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_OPEN]]: isNodeOpened(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_ROOT]]: isRootNode(item),
    fullPath: getNodeAttr(item, NODE_ATTRIBUTES.PATH),
    uuid: getNodeId(item),
    parent: getNodeAttr(item, NODE_ATTRIBUTES.PARENT),
    parentId: getNodeId(getNodeAttr(item, NODE_ATTRIBUTES.PARENT)),
  });

  const extendNodeAttr = (item: TreeNode) =>
    Object.assign({}, item, {
      [NODE_ATTRIBUTES.TREE_NODE_ATTR]: resolveScopedSlotParam(item),
    });

  const extendNodeScopedData = (item: TreeNode) => ({
    data: item,
    attributes: resolveScopedSlotParam(item),
  });

  /**
   * 组装进入可视区域元素返回数据
   * @param target
   * @returns
   */
  const getIntersectionResponse = (target: HTMLElement | TreeNode) => {
    if (!target) {
      return null;
    }

    let node = target;
    if (isElement(target)) {
      node = getNodeById((target as HTMLElement).getAttribute('data-tree-node'));
    }

    const level = getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.DEPTH);
    const isRoot = getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.IS_ROOT);
    const parent = getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.PARENT);
    const index = isRoot
      ? getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.INDEX)
      : parent?.[props.children]?.findIndex(child => child === node);
    return { level, target, index, parent, node, isRoot };
  };

  return {
    getSchemaVal,
    getNodeAttr,
    getNodeId,
    getNodeById,
    getNodeParentId,
    getParentNodeData,
    getNodePathById,
    getNodeAttrById,
    getNodeParentIdById,
    getParentNodeAttr,
    getParentNode,
    setNodeAttr,
    setNodeAttrById,
    getNodePath,
    isRootNode,
    isNodeOpened,
    hasChildNode,
    isItemOpen,
    isNodeChecked,
    isNodeMatched,
    isNodeLoading,
    checkNodeIsOpen,
    getSourceNodeByPath,
    getSourceNodeByUID,
    isMatchedNode,
    resolveScopedSlotParam,
    setTreeNodeLoading,
    extendNodeAttr,
    getChildNodes,
    extendNodeScopedData,
    getIntersectionResponse,
  };
};

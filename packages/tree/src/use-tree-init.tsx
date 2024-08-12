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

import { onMounted, reactive, watch } from 'vue';

import { v4 as uuidv4 } from 'uuid';

import { NODE_ATTRIBUTES, NODE_SOURCE_ATTRS } from './constant';
import { TreeNode, TreePropTypes } from './props';
import useNodeAsync from './use-node-async';
import { resolvePropIsMatched, showCheckbox } from './util';

export default (props: TreePropTypes) => {
  /**
   * 扁平化当前数据
   * @param treeData 树形结构数据
   * @param cachedSchema 缓存数据
   * @returns
   */
  const getFlatdata = (
    treeData: Array<TreeNode> = undefined,
    cachedSchema: WeakMap<TreeNode, Record<string, unknown>> = null,
  ) => {
    const { data, children } = props;
    const checkedList = [];
    const outputData = [];
    let order = 0;
    const treeSchema = new WeakMap();

    /**
     * 递归更新节点属性
     * @param node 当前节点
     * @param attrName 需要更新的节点属性名称
     * @param attrValue 需要更新的节点属性值
     * @param callFn 回调函数
     * @returns
     */
    function loopUpdateNodeAttr(
      node: TreeNode,
      attrName: string,
      attrValue: Record<string, unknown> | boolean | number | string,
      callFn: (...args) => boolean,
    ) {
      if (node === undefined || node === null) {
        return;
      }

      if (treeSchema.has(node)) {
        const target = treeSchema.get(node);
        if (Object.prototype.hasOwnProperty.call(target, attrName)) {
          if (typeof callFn === 'function' && Reflect.apply(callFn, self, [target, attrName, attrValue, node])) {
            if (target[attrName] === attrValue) {
              return;
            }

            Object.assign(target, { [attrName]: attrValue });
            loopUpdateNodeAttr(target[NODE_ATTRIBUTES.PARENT], attrName, attrValue, callFn);
          }
        }
      }
    }

    function getUid(item: TreeNode) {
      let uid = null;
      if (typeof props.nodeKey === 'string') {
        uid = item[props.nodeKey] || uuidv4();
      }

      return uid || item[NODE_ATTRIBUTES.UUID] || uuidv4();
    }

    /**
     * 默认设置
     * 如果传入数据没有设置相关属性值
     * 这里会自动生成
     */
    const cachedDefaultVal = {
      [NODE_ATTRIBUTES.IS_OPEN]: () => !!props.expandAll,
      [NODE_ATTRIBUTES.IS_CHECKED]: () => false,
      [NODE_ATTRIBUTES.IS_MATCH]: () => false,
      [NODE_ATTRIBUTES.IS_SELECTED]: (node: TreeNode, uuid) => resolvePropIsMatched(node, props.selected, uuid),
      [NODE_ATTRIBUTES.IS_CACHED]: () => false,
      [NODE_ATTRIBUTES.IS_ASYNC]: () => null,
      [NODE_ATTRIBUTES.IS_LOADING]: () => false,
    };

    /**
     * 根据Props设置和已缓存数据解析当前节点对应属性值
     * @param uuid 当前节点id
     * @param node 当前节点
     * @param cachedAttr 当前节点属性名称
     * @param defVal 默认值
     */
    function getCachedTreeNodeAttr(uuid, node: TreeNode, cachedAttr: string, defVal = undefined) {
      let defaultValue = defVal;
      // 设置默认值
      if (defVal === undefined && typeof cachedDefaultVal[cachedAttr] === 'function') {
        defaultValue = cachedDefaultVal[cachedAttr](node, uuid);
      }

      // 通过映射配置，检查当前数据是否设置相关属性值
      // 如果传入数据设置了相关属性值，则返回传入数据设置值
      const sourceAttr = NODE_SOURCE_ATTRS[cachedAttr];
      if (Object.prototype.hasOwnProperty.call(node, sourceAttr)) {
        return node[sourceAttr];
      }

      // 判断是缓存数据是否已经处理过此属性
      // 在数据改变时，如果缓存数据没有处理过此属性，则返回默认值
      const cached = cachedSchema?.get(node) ?? undefined;
      let result = undefined;
      if (cached) {
        result = cached[cachedAttr];
      }

      // 处理默认值
      if (result === undefined || result === null) {
        result = defaultValue;
      }

      return result;
    }

    /**
     * 当前节点是否是选中状态
     * @param uuid 当前节点id
     * @param node 当前节点
     * @returns
     */
    function isCachedTreeNodeSelected(uuid: string, node: TreeNode) {
      if (!props.selectable) {
        return false;
      }

      const isMatch = resolvePropIsMatched(node, props.selected, uuid);
      return getCachedTreeNodeAttr(uuid, node, NODE_ATTRIBUTES.IS_SELECTED, isMatch);
    }

    function isNodeOpend(uuid, item, parent) {
      const isItemOpened = getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_OPEN);
      const isParentOpened = treeSchema.has(parent) ? treeSchema.get(parent)?.[NODE_ATTRIBUTES.IS_OPEN] : true;
      return isItemOpened && isParentOpened;
    }

    function isCheckedNode(node, uuid, attributes) {
      const isChecked = showCheckbox(props, { data: node, attributes });
      if (!isChecked) {
        return false;
      }

      const isMatch = resolvePropIsMatched(node, props.checked, uuid);
      return getCachedTreeNodeAttr(uuid, node, NODE_ATTRIBUTES.IS_CHECKED, isMatch);
    }

    function validateIsOpenLoopFn(targetAttr: Record<string, unknown>) {
      return !(targetAttr?.[NODE_ATTRIBUTES.IS_OPEN] ?? false);
    }

    function loopUpdateCheckedEvent(target, _attrName, _attrValue, node) {
      target[NODE_ATTRIBUTES.IS_INDETERMINATE] = (node[props.children] || []).some(
        child => !(treeSchema.get(child)?.[NODE_ATTRIBUTES.IS_CHECKED] ?? false),
      );

      return true;
    }

    function flatten(array: Array<TreeNode>, depth = 0, parent = null, path = null) {
      const arrLength = array.length;
      for (let i = 0; i < arrLength; i++) {
        const item = array[i];
        if (Array.isArray(item)) {
          flatten(item, depth, parent, path);
        } else {
          if (typeof item === 'object' && item !== null) {
            const currentPath = path !== null ? `${path}-${i}` : `${i}`;
            const uuid = `${getUid(item)}`;
            const hasChildren = !!((item[children] || []) as TreeNode[]).length;
            /**
             * 当前节点设置是否为展开状态
             */
            let isOpened = getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_OPEN);

            /**
             * 如果初始化发现当前属性为展开或者选中 & 设置了 autoOpenParentNode = true
             * 此时需要设置当前节点的所有父级节点都为展开状态
             */
            if (props.autoOpenParentNode) {
              isOpened && loopUpdateNodeAttr(parent, NODE_ATTRIBUTES.IS_OPEN, true, validateIsOpenLoopFn);
            } else {
              /**
               * 如果没有设置自动展开所有父级
               * 此时需要判定当前节点是否可以展开状态需要同时判定父级是否展开
               * 如果父级不是展开状态，此节点不能展示，应该也是关闭状态，只有当父级展开时，此节点才为展开状态
               */
              isOpened = isNodeOpend(uuid, item, parent);
            }

            const attributes = {
              [NODE_ATTRIBUTES.DEPTH]: depth,
              [NODE_ATTRIBUTES.INDEX]: i,
              [NODE_ATTRIBUTES.UUID]: uuid,
              [NODE_ATTRIBUTES.PARENT]: parent,
              [NODE_ATTRIBUTES.HAS_CHILD]: hasChildren,
              [NODE_ATTRIBUTES.PATH]: currentPath,
              [NODE_ATTRIBUTES.IS_ROOT]: parent === null,
              [NODE_ATTRIBUTES.ORDER]: order,
              [NODE_ATTRIBUTES.IS_SELECTED]: isCachedTreeNodeSelected(uuid, item),
              [NODE_ATTRIBUTES.IS_MATCH]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_MATCH),
              [NODE_ATTRIBUTES.IS_OPEN]: isOpened,
              [NODE_ATTRIBUTES.IS_CHECKED]: undefined,
              [NODE_ATTRIBUTES.IS_CACHED]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_CACHED),
              [NODE_ATTRIBUTES.IS_ASYNC]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_ASYNC),
              [NODE_ATTRIBUTES.IS_LOADING]: getCachedTreeNodeAttr(uuid, item, NODE_ATTRIBUTES.IS_LOADING),
              [NODE_ATTRIBUTES.IS_INDETERMINATE]: false,
            };

            attributes[NODE_ATTRIBUTES.IS_CHECKED] = isCheckedNode(item, uuid, attributes);
            if (attributes[NODE_ATTRIBUTES.IS_CHECKED]) {
              checkedList.push(item);
            }

            treeSchema.set(item, attributes);
            outputData.push(item);
            order += 1;

            if (Object.prototype.hasOwnProperty.call(item, children)) {
              flatten((item[children] || []) as TreeNode[], depth + 1, item, currentPath);
            }
          }
        }
      }
    }
    flatten(treeData ?? data);
    if (props.showCheckbox !== false && props.checkStrictly) {
      checkedList?.forEach(value => {
        loopUpdateNodeAttr(value, NODE_ATTRIBUTES.IS_CHECKED, true, loopUpdateCheckedEvent);
      });
    }
    return [outputData, treeSchema];
  };

  const formatData = getFlatdata();

  const nextLoopEvents: Map<string, (...args) => void> = new Map();
  const afterSelectEvents = [];
  const afterSelectWatch = [];

  /**
   * 扁平化数据
   * schema: 需要展示连线时，用于计算连线高度
   */
  const flatData = reactive({
    data: formatData[0] as Array<TreeNode>,
    schema: formatData[1] as WeakMap<TreeNode, Record<string, unknown>>,
    levelLineSchema: {},
  });

  const { asyncNodeClick, deepAutoOpen } = useNodeAsync(props, flatData);

  /**
   * 抛出缓存函数，用于注册selected watch
   * @param event
   */
  const onSelected = (event: (d) => void) => {
    afterSelectEvents.push(event);
  };

  const registerNextLoop = (key: string, event, reset = true) => {
    if (reset && nextLoopEvents.has(key)) {
      nextLoopEvents.delete(key);
    }

    nextLoopEvents.set(key, event);
  };

  const resolveEventOption = event => {
    if (typeof event === 'function') {
      return {
        type: 'loop',
        fn: event,
      };
    }

    if (typeof event === 'object' && typeof event.type === 'string' && typeof event.fn === 'function') {
      return event;
    }

    console.error('loop event error', event);
    return null;
  };

  const executeFn = event => {
    const resoveEvent = resolveEventOption(event);
    if (resoveEvent !== null) {
      Reflect.apply(resoveEvent.fn, this, []);
    }

    return resoveEvent?.type ?? 'once';
  };

  const executeNextEvent = () => {
    Array.from(nextLoopEvents.keys()).forEach((key: string) => {
      const target = nextLoopEvents.get(key);
      if (Array.isArray(target)) {
        const clearList = [];
        target.forEach((event, index: number) => {
          const result = executeFn(event);
          if (result === 'once') {
            clearList.unshift(index);
          }
        });

        if (clearList.length) {
          clearList.forEach((index: number) => target.splice(index, 1));
        }

        if (target.length === 0) {
          nextLoopEvents.delete(key);
        }
      } else {
        const result = executeFn(target);
        if (result === 'once') {
          nextLoopEvents.delete(key);
        }
      }
    });
  };

  /**
   * 监听组件配置Data改变
   */
  watch(
    () => [props.data],
    newData => {
      const formatData = getFlatdata(newData[0], flatData.schema);
      flatData.data = formatData[0] as Array<TreeNode>;
      flatData.schema = formatData[1] as WeakMap<TreeNode, Record<string, unknown>>;
      if (props.async?.callback && props.async?.deepAutoOpen === 'every') {
        deepAutoOpen();
      }

      /**
       * 执行缓存下来的周期函数
       * 保证data改变之后执行相关操作
       */
      executeNextEvent();
    },
    {
      deep: true,
    },
  );

  if (props.selectable) {
    onMounted(() => {
      watch(
        () => props.selected,
        newData => {
          // console.log('watch selected changed');
          afterSelectWatch.length = 0;
          afterSelectEvents.forEach((event: () => void) => {
            Reflect.apply(event, this, [newData]);

            /**
             * selected设置生效有可能会在props.data 改变之前
             * 此时需要缓存当前执行函数，保证在watch data change 之后执行
             */
            afterSelectWatch.push(() => Reflect.apply(event, this, [newData]));
          });
          registerNextLoop('afterSelectWatch', afterSelectWatch);
        },
        { immediate: true },
      );
    });
  }

  const afterDataUpdate = (callFn: (d) => void) => {
    registerNextLoop('afterDataUpdate', callFn);
  };

  /** 如果设置了异步请求 */
  if (props.async?.callback) {
    deepAutoOpen();
  }

  return {
    flatData,
    asyncNodeClick,
    deepAutoOpen,
    afterDataUpdate,
    registerNextLoop,
    onSelected,
  };
};

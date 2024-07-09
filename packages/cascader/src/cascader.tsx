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

import { computed, defineComponent, nextTick, ref, toRefs, watch } from 'vue';
import { array } from 'vue-types';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { bkTooltips } from '@bkui-vue/directives';
import { AngleUp, Close, Error } from '@bkui-vue/icon';
import Popover from '@bkui-vue/popover';
import { debounce, PropTypes } from '@bkui-vue/shared';
import Tag from '@bkui-vue/tag';

import { useHover } from '../../select/src/common';
import { useTagsOverflow } from '../../tag-input/src/common';
import CascaderPanel from './cascader-panel';
import { INode } from './interface';
import Store from './store';

export default defineComponent({
  name: 'Cascader',
  directives: {
    bkTooltips,
  },
  props: {
    modelValue: PropTypes.arrayOf(PropTypes.oneOfType([array<string>(), String, Number])),
    list: PropTypes.array.def([]),
    placeholder: PropTypes.string.def(''),
    behavior: PropTypes.string.def('normal'),
    filterable: PropTypes.bool.def(false),
    multiple: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    clearable: PropTypes.bool.def(true),
    trigger: PropTypes.string.def('click'),
    checkAnyLevel: PropTypes.bool.def(false),
    isRemote: PropTypes.bool.def(false),
    remoteMethod: PropTypes.func,
    showCompleteName: PropTypes.bool.def(true),
    idKey: PropTypes.string.def('id'),
    nameKey: PropTypes.string.def('name'),
    childrenKey: PropTypes.string.def('children'),
    separator: PropTypes.string.def('/'),
    limitOneLine: PropTypes.bool.def(false),
    extCls: PropTypes.string.def(''),
    filterMethod: PropTypes.func,
    scrollHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(216),
    scrollWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),
    customTextFillback: PropTypes.func,
    customTagsFillback: PropTypes.func,
    collapseTags: {
      type: Boolean,
      default: true,
    },
    floatMode: {
      // 当floatMode为true时为漂浮模式,不会挤占空间
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change', 'clear', 'toggle', 'focus'],
  setup(props, { emit, slots }) {
    const t = useLocale('cascader');

    const { separator, multiple } = props;
    // 用useHover自定义hook来处理鼠标hover状态
    const { isHover, setHover, cancelHover } = useHover();

    const store = ref(new Store(props));

    // 定义selectedText变量用于记录当前选择的值的文本
    const selectedText = ref<string>('');

    // 定义selectedTags变量用于记录多选模式下已选的tag
    const selectedTags = ref([]);

    const { modelValue } = toRefs(props);

    // 定义cascaderPanel 引用
    const cascaderPanel = ref();

    // 定义searchKey变量，支持搜索时，搜索框绑定变量
    const searchKey = ref<string>('');

    // 定义suggestions变量，搜索功能打开时，面板给出的列表
    const suggestions = ref([]);

    // 定义isFiltering变量，记录是否正在搜索，过滤
    const isFiltering = ref(false);

    // 定义isEdit变量，记录是否处于编辑状态
    const isEdit = ref(false);

    // 定义isFocus变量，记录是否处于焦点状态
    const isFocus = ref(false);

    // 定义isShowPanel变量，用于标致面板显示
    const isShowPanel = ref(false);

    // 用computed定义checkedValue变量，用于监听modelValue的变化
    const checkedValue = computed({
      get: () => modelValue.value,
      set: (value: Array<number | string | string[]>) => {
        emit('update:modelValue', value);
      },
    });

    // 定义popover变量
    const popover = ref(null);

    // 定义bkCascaderRef和inputRef变量
    const bkCascaderRef = ref(null);
    const inputRef = ref(null);

    // 用computed定义placeholder变量，用于处理props中的placeholder属性
    const placeholder = computed(() => (props.placeholder ? props.placeholder : t.value.pleaseSelect));

    const displayText = computed(() => {
      if (props.customTextFillback) {
        return props.customTextFillback(props.modelValue, store.value.getFlattedNodes());
      }
      return selectedText.value;
    });

    // 根据配置，获取输入框显示的text
    const getShowText = (node: INode) =>
      props.showCompleteName ? node.pathNames.join(separator) : node.pathNames[node.pathNames.length - 1];

    // 更新搜索框的值
    const updateSearchKey = () => {
      searchKey.value = selectedText.value;
    };

    const searchBlueHandler = () => {
      // 单选搜索框与选择框互斥，因此一旦失去焦点，认为是没有选择，还原选择框的内容
      if (!props.multiple) {
        searchKey.value = selectedText.value;
        return;
      }

      // 多选下，失去焦点则需要删除搜索框
      searchKey.value = '';
    };

    // 更新选中
    const updateValue = (val: Array<number | string | string[]>) => {
      // 更新多选情况下的选中标签
      if (multiple) {
        store.value.setNodesCheck(val as Array<string[]>); // 同步节点选中的状态
        selectedTags.value = store.value
          .getCheckedNodes()
          .filter((node: INode) => store.value.config.checkAnyLevel || node.isLeaf) // 根据 checkAnyLevel 配置过滤选中的节点
          .map((node: INode) => ({
            text: getShowText(node), // 获取节点的显示文本
            key: node.id, // 获取节点的唯一键
          }));
        selectedText.value = selectedTags.value.map(item => item.text).join(', '); // 生成选中文本
        return;
      }

      // 如果 checkAnyLevel 配置为 false，则隐藏弹出框
      if (!props.checkAnyLevel) {
        popover?.value?.hide();
      }

      // 获取与选中值对应的节点
      const node = store.value.getNodeByValue(val);
      selectedText.value = node ? getShowText(node) : ''; // 获取节点的显示文本，如果节点不存在则赋值为空字符串
      updateSearchKey(); // 更新搜索关键字
    };

    // 清空所选内容，要stopPropagation防止触发下拉
    const handleClear = (e: Event) => {
      e.stopPropagation();
      store.value.clearChecked();
      searchKey.value = '';
      updateValue([]);
      emit('update:modelValue', []);
      emit('clear', JSON.parse(JSON.stringify(props.modelValue)));
    };

    // 移除tag
    const removeTag = (value, index, e) => {
      e.stopPropagation();
      const current = JSON.parse(JSON.stringify(value));
      const tag = current.splice(index, 1)[0];
      isEdit.value = true; // 删除时也在编辑态，触发overflowTagIndex的计算
      store.value.removeTag(tag);
      updateValue(current);
      emit(
        'update:modelValue',
        store.value.getCheckedNodes().map((node: INode) => node.path),
      );
      // 计算过后，关闭编辑状态
      setTimeout(() => {
        isEdit.value = isFocus.value;
      });
    };

    // modelValue的监听函数
    const modelValueChangeHandler = (value, oldValue) => {
      updateValue(value);
      // 派发相关事件
      emit('update:modelValue', value);
      oldValue !== undefined && emit('change', value); // oldValue = undefined代表初始化，init不派发change事件
      // 如果有过滤搜索，选择后，自动focus到input
      inputRef?.value?.focus();

      // 选择后过滤条件清除，面板初始化渲染
      isFiltering.value = false;
    };

    // list的监听函数
    const listChangeHandler = () => {
      store.value = new Store(props);
      updateValue(props.modelValue);
    };

    // popover的监听函数
    const popoverChangeEmitter = val => {
      isShowPanel.value = val.isShow;

      emit('toggle', val.isShow);

      isEdit.value = val.isShow;

      // popover激活后，focus相应事件
      isFocus.value = val.isShow;
      nextTick(() => {
        val && inputRef.value?.focus();
      });

      val.isShow && focusEmitter(); // 面板打开，触发focus事件
      // 面板收起，搜索状态关闭
      if (!val.isShow) {
        isFiltering.value = false;
      }
    };

    // 搜索框输入的处理函数
    const searchInputHandler = debounce(200, (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      searchKey.value = target.value;
      if (searchKey.value === '') {
        // 如果搜索关键字为空，则取消过滤
        isFiltering.value = false;
        return;
      }
      // 开始过滤
      isFiltering.value = true;
      isFiltering.value = true;

      // 筛选方法，如果props中存在filterMethod，则使用props中的方法，否则使用默认方法
      const filterMethod = props.filterMethod
        ? props.filterMethod
        : (node: INode) => {
            if (props.checkAnyLevel) {
              // 检查是否需要搜索所有层级的节点
              return node.pathNames.join(props.separator).includes(searchKey.value);
            }
            // 只搜索叶子节点，并且路径中包含搜索关键字
            return node.isLeaf && node.pathNames.join(props.separator).includes(searchKey.value);
          };

      // 获取所有节点并进行过滤
      const targetNodes = store.value.getFlattedNodes().filter((node: INode) => filterMethod(node, searchKey.value));
      suggestions.value = targetNodes;
      // 如果popover存在且未显示，则显示popover
      !popover?.value.isShow && popover?.value.show();
    });

    // focus事件的处理函数
    const focusEmitter = () => {
      emit('focus');
    };

    // 监听modelValue的变化
    watch(() => props.modelValue, modelValueChangeHandler, { immediate: true });

    // 监听list的变化
    watch(() => props.list, listChangeHandler, { deep: true, immediate: true });

    // 定义overflowTagIndex变量，用于处理tag的折叠
    const tagList = computed(() =>
      props.customTagsFillback
        ? props.customTagsFillback(props.modelValue, store.value.getFlattedNodes())
        : selectedTags.value.map(item => item.text),
    );
    const isCollapse = computed(() => (props.collapseTags ? props.collapseTags && isFocus.value : props.collapseTags));
    const isEditMode = computed(() => (props.collapseTags ? props.collapseTags && isEdit.value : props.collapseTags));

    // 如果使用了trigger插槽，则不存在bkCascaderRef，做兼容处理
    const { overflowTagIndex } = slots.trigger
      ? { overflowTagIndex: null }
      : useTagsOverflow(bkCascaderRef, isEditMode, tagList);

    const { resolveClassName } = usePrefix();

    // 返回组件所需的变量和函数
    return {
      calcuPlaceholder: placeholder,
      bkCascaderRef,
      inputRef,
      overflowTagIndex,
      isCollapse,
      isFocus,
      store,
      updateValue,
      selectedText,
      checkedValue,
      handleClear,
      isHover,
      setHover,
      popover,
      cancelHover,
      selectedTags,
      removeTag,
      cascaderPanel,
      popoverChangeEmitter,
      searchKey,
      suggestions,
      isFiltering,
      searchInputHandler,
      focusEmitter,
      tagList,
      isEdit,
      displayText,
      resolveClassName,
      isShowPanel,
      searchBlueHandler,
    };
  },
  render() {
    // 定义suffixIcon函数，用于根据不同情况渲染后缀图标
    const suffixIcon = () => {
      if (this.clearable && this.isHover && !this.disabled) {
        // 当可清空、鼠标悬浮且未禁用时，渲染清空图标
        return (
          <Close
            class={this.resolveClassName('icon-clear-icon')}
            onClick={this.handleClear}
          ></Close>
        );
      }
      // 否则渲染展开/收起图标
      return <AngleUp class={[this.resolveClassName('icon-angle-up'), this.isShowPanel ? 'active' : '']}></AngleUp>;
    };

    // 因为cascader的tag长短不一，在计算时如果overflowIndex为0，会出现直接+n渲染的情况，因此需要对其进行修正
    this.overflowTagIndex = this.overflowTagIndex === 0 ? 1 : this.overflowTagIndex;

    // 根据overflowTagIndex获取需要收起的tag，并生成tooltip
    const collapseTooltip = this.tagList.reduce((acc, cur, curIndex) => {
      if (this.overflowTagIndex !== null && curIndex >= this.overflowTagIndex) {
        acc.push(cur);
      }
      return acc;
    }, []);

    // 定义renderTags函数，用于渲染选中的tag
    const renderTags = () => {
      if (this.limitOneLine) {
        // 如果limitOneLine为true，则只显示一行
        return <span class='cascader-selected-text'>{this.displayText}</span>;
      }
      return (
        <div class='cascader-tag-list'>
          {this.tagList.map((tag, index) => {
            const isOverflow = !this.isCollapse && this.overflowTagIndex !== null && index >= this.overflowTagIndex;
            // 根据tag是否超出显示范围，来决定是否渲染
            return (
              <span
                key={tag}
                style={{ display: isOverflow ? 'none' : '' }}
                class='tag-item'
              >
                <span class='tag-item-name'>{tag}</span>
                <Error
                  class={this.resolveClassName('icon-clear-icon')}
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    this.removeTag(this.modelValue, index, e);
                  }}
                ></Error>
              </span>
            );
          })}
          {this.overflowTagIndex !== null && !this.isCollapse && (
            <Tag
              style='margin-top: 0'
              v-bk-tooltips={collapseTooltip.join(', ')}
            >
              +{this.selectedTags.length - this.overflowTagIndex}
            </Tag>
          )}
        </div>
      );
    };

    const textRender = () =>
      // 多选时， text被tagRender填充，不需要进行text渲染
      this.multiple ? null : <span>{this.displayText}</span>;

    // 定义popoverRender函数，用于渲染弹出框
    const popoverRender = () => (
      <Popover
        ref='popover'
        class={this.resolveClassName('cascader-popover-wrapper')}
        arrow={false}
        boundary='body'
        disabled={this.disabled}
        offset={4}
        placement='bottom-start'
        theme={`light ${this.resolveClassName('cascader-popover')}`}
        trigger='click'
        onAfterHidden={this.popoverChangeEmitter}
        onAfterShow={this.popoverChangeEmitter}
      >
        {{
          default: () =>
            this.$slots.trigger ? (
              this.$slots.trigger({ selected: this.modelValue, isShow: this.isShowPanel })
            ) : (
              <div class={[this.resolveClassName('cascader-name'), this.resolveClassName('scroll-y')]}>
                {this.multiple && this.selectedTags.length > 0 && renderTags()}
                {this.filterable
                  ? (this.isCollapse || this.selectedTags.length === 0) && (
                      <input
                        ref='inputRef'
                        class={[
                          this.resolveClassName('cascader-search-input'),
                          {
                            'is-disabled': this.disabled,
                          },
                        ]}
                        disabled={this.disabled}
                        placeholder={this.calcuPlaceholder}
                        type='text'
                        value={this.searchKey}
                        onBlur={this.searchBlueHandler}
                        onInput={this.searchInputHandler}
                      />
                    )
                  : textRender()}
              </div>
            ),
          content: () => (
            <div class={this.resolveClassName('cascader-popover')}>
              <CascaderPanel
                ref='cascaderPanel'
                width={this.scrollWidth}
                height={this.scrollHeight}
                v-model={this.checkedValue}
                v-slots={{
                  default: scope =>
                    this.$slots.default ? (
                      this.$slots.default(scope)
                    ) : (
                      <span class={this.resolveClassName('cascader-node-name')}>{scope.node.name}</span>
                    ),
                }}
                is-filtering={this.isFiltering}
                search-key={this.searchKey}
                separator={this.separator}
                store={this.store}
                suggestions={this.suggestions}
              ></CascaderPanel>
            </div>
          ),
        }}
      </Popover>
    );

    return (
      <div class={[this.resolveClassName('cascader-wrapper'), this.floatMode ? 'float-mode' : '']}>
        {this.$slots.trigger ? (
          popoverRender()
        ) : (
          <div
            ref='bkCascaderRef'
            class={[
              this.resolveClassName('cascader'),
              this.extCls,
              {
                'is-unselected': this.modelValue.length === 0,
                'is-hover': this.isHover,
                'is-filterable': this.filterable,
                'is-focus': this.isFocus,
                'is-disabled': this.disabled,
                'is-simplicity': this.behavior === 'simplicity',
              },
            ]}
            data-placeholder={this.calcuPlaceholder}
            tabindex='0'
            onMouseenter={this.setHover}
            onMouseleave={this.cancelHover}
          >
            {suffixIcon()}
            {popoverRender()}
          </div>
        )}
      </div>
    );
  },
});

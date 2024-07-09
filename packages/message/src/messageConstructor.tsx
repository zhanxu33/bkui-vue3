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

import {
  computed,
  defineComponent,
  isVNode,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  StyleValue,
  Transition,
  VNode,
  watch,
} from 'vue';
import { toType } from 'vue-types';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import {
  AngleDoubleDownLine,
  AngleDoubleUpLine,
  Assistant,
  Close,
  CopyShape,
  Error,
  FixLine,
  FixShape,
  Info,
  Success,
  Warn,
} from '@bkui-vue/icon';
import { bkZIndexManager, isElement, PropTypes } from '@bkui-vue/shared';
import ClipboardJS from 'clipboard';
import JSONFormatter from 'json-formatter-js';

enum MessageThemeEnum {
  ERROR = 'error',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
}

enum MessageContentType {
  JSON = 'json',
  KEY_VALUE = 'key-value',
}

enum IMessageActionType {
  /**
   * 联系助手：默认直接拉起企业微信与助手的聊天，需要在 message.assistant 配置对应的企微群ID
   */
  ASSISTANT = 'assistant',

  /**
   * 关闭：点击关闭，Message 消失
   */
  CLOSE = 'close',

  /**
   * 展开详情：展开面向开发的详情
   */
  DETAILS = 'details',

  /**
   * 图钉按钮：点击后，Message 不会自动消失
   */
  FIX = 'fix',
}

type IMessageAction = {
  /**
   * 唯一ID，从给定的 IMessageActionType 中选择
   * 如果是自定义的其他操作，此ID可以自定义，此时将会作为一个新的操作项追加
   */
  id: IMessageActionType;

  /**
   * 需要展示的文本，如果不设置显示默认
   */
  text?: () => string | string;

  /**
   * 需要展示的ICON，如果不设置显示默认
   */
  icon?: () => VNode | VNode | string;

  /**
   * 鼠标点击事件，如果返回false则阻止默认点击行为
   * 如果返回其他，默认行为不会阻止
   * @returns
   */
  onClick?: (...args) => boolean | void;

  /**
   * 自定义渲染 & 事件处理
   * 如果设置了render则整个渲染都需要自己处理，默认渲染将会被阻止
   * @returns VNode
   */
  render?: () => VNode;

  /**
   * 是否禁用此功能
   * 如果设置为true，则此功能不展示
   */
  disabled?: boolean;

  /**
   * 是否只读
   * 如果设置为true，则此功能只做文本展示
   */
  readonly?: boolean;

  /**
   * 需要添加到操作项外层元素的样式列表
   */
  classList?: string | string[];
};

type IMessageActions = IMessageAction[];

export type IMessage = {
  /**
   * 错误码
   */
  code: number | string;

  /**
   * 错误概述
   */
  overview: string;

  /**
   * 操作建议
   */
  suggestion: string;

  /**
   * 详情
   */
  details: Array<Record<string, any> | boolean | number | string> | Record<string, any> | string;

  /**
   * 助手
   */
  assistant: string;

  /**
   * 展开详情：数据展示格式
   * 详情分为：Key Value 类详情、JSON 类详情
   * 可选值：'key-value', 'json'
   */
  type: MessageContentType;
};

export type IMessageProp = IMessage | string;

const messageProps = {
  id: PropTypes.string.def(''),
  message: toType<IMessageProp>('IMessage', {}),
  theme: toType<`${MessageThemeEnum}`>('messageTheme', {}).def(MessageThemeEnum.PRIMARY),
  delay: PropTypes.number,
  dismissable: PropTypes.bool.def(true),
  offsetY: PropTypes.number.def(30),
  spacing: PropTypes.number.def(10),
  extCls: PropTypes.string.def(''),
  onClose: PropTypes.func,
  getContainer: PropTypes.instanceOf(HTMLElement),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(100),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('100%'),
  actions: toType<IMessageActions>('IMessageAction', {}),
};

export default defineComponent({
  name: 'Message',
  props: messageProps,
  emits: ['destroy', 'detail'],
  setup(props, { emit, slots, expose }) {
    const t = useLocale('message');
    const { resolveClassName } = usePrefix();
    const classNames = computed(() => [
      `${resolveClassName('message')}`,
      `${resolveClassName(`message-${props.theme}`)}`,
      `${props.extCls}`,
    ]);
    const zIndex = bkZIndexManager.getMessageNextIndex();

    const singleLineWidth = 560;
    const advanceWidth = 800;

    const singleLineDelay = 3000;
    const advanceDelay = 8000;

    const timerDelay = computed(() => {
      if (/^\d+\.?\d*$/.test(`${props.delay}`)) {
        return props.delay;
      }

      if (typeof props.message === 'object' && !isVNode(props.message)) {
        return advanceDelay;
      }

      return singleLineDelay;
    });

    const getPropNumberAsStringValue = key => (typeof props[key] === 'number' ? `${props[key]}px` : props[key]);

    const contentWidth = computed(() => {
      const minMaxWidth = {
        maxWidth: getPropNumberAsStringValue('maxWidth'),
        minWidth: getPropNumberAsStringValue('minWidth'),
      };

      const isAdvance = typeof props.message === 'object' && !isVNode(props.message);
      if (/%$/.test(`${props.width}`) || /auto/gi.test(`${props.width}`)) {
        return {
          width: props.width,
          ...minMaxWidth,
        };
      }

      if (/^\d+/.test(`${props.width}`)) {
        return /^\d+\.?\d*$/.test(`${props.width}`)
          ? {
              width: `${props.width}px`,
              ...minMaxWidth,
            }
          : {
              width: props.width,
              ...minMaxWidth,
            };
      }

      if (isAdvance) {
        return { width: `${advanceWidth}px` };
      }

      return { width: `${singleLineWidth}px` };
    });

    const isGetContainer = computed<boolean>(() => props.getContainer && isElement(props.getContainer));
    const styles = computed(() =>
      Object.assign(
        {
          top: `${props.offsetY}px`,
          zIndex,
          position: (isGetContainer.value ? 'absolute' : 'fixed') as 'absolute' | 'fixed',
        },
        contentWidth.value,
      ),
    );

    const refJsonContent = ref(null);
    const refCopyStatus = ref(null);
    const refCopyMsgDiv = ref(null);
    const visible = ref(false);
    const toolOperation = reactive({
      isFix: false,
      isDetailShow: false,
    });

    let timer = null;
    const startTimer = () => {
      timer = setTimeout(() => {
        if (toolOperation.isFix) {
          return;
        }

        visible.value = false;
      }, timerDelay.value);
    };

    const close = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      visible.value = false;
    };

    let copyStatusTimer;
    const copyStatus = ref(null);

    const parseToString = value => {
      let targetStr = value;
      if (typeof value === 'object') {
        try {
          targetStr = JSON.stringify(value);
        } catch (e) {
          console.error(`JSON.stringify Error: ${e}`);
        }
      }

      return targetStr;
    };

    const copyMessage = () => {
      const copyInstance = new ClipboardJS(refCopyMsgDiv.value as HTMLElement, {
        text: () => parseToString((props.message as any).details),
      });

      registerCopyCallback(copyInstance);
    };

    const registerCopyCallback = (copyInstance, complete?) => {
      ['success', 'error'].forEach(theme => {
        copyInstance.on(theme, e => {
          const target = refCopyStatus.value as HTMLElement;
          copyStatus.value = theme;
          if (target) {
            const { offsetLeft, offsetWidth, offsetTop } = e.trigger;
            const msgTree = e.trigger.closest('.message-tree');
            const msgTreeScrollTop = msgTree ? msgTree.scrollTop : 0;
            target.classList.remove(...['success', 'error', 'is-hidden']);
            target.classList.add(...[theme, 'is-show']);
            const transX = offsetLeft + offsetWidth / 2 - 41;
            const transY = offsetTop - msgTreeScrollTop - 40;
            target.style.setProperty('transform', `translate(${transX}px, ${transY}px`);
            copyStatusTimer && clearTimeout(copyStatusTimer);
            copyStatusTimer = setTimeout(() => {
              target.classList.remove(...['is-show']);
              target.classList.add(...['is-hidden']);
            }, 2000);
          }

          if (typeof complete === 'function') {
            complete();
          }
        });
      });
    };

    const copyValueItem = () => {
      const copyInstance = new ClipboardJS(refJsonContent.value.querySelectorAll('span.copy-value'), {
        text: trigger => trigger.innerHTML,
      });

      registerCopyCallback(copyInstance);
    };

    const parseToJson = value => {
      let targetJson = value;
      if (typeof value === 'string') {
        try {
          targetJson = JSON.parse(value);
        } catch (e) {
          console.error(`Format Json Error: ${e}`);
        }
      }

      return targetJson;
    };

    const setDetailsShow = (e: MouseEvent, isShow?: boolean) => {
      toolOperation.isDetailShow = isShow ?? !toolOperation.isDetailShow;
      fixMesage(e, toolOperation.isDetailShow);

      if (toolOperation.isDetailShow && typeof props.message === 'object' && !isVNode(props.message)) {
        if (props.message.type === MessageContentType.JSON || !props.message.type) {
          const targetJson = parseToJson(props.message.details);
          const formatter = new JSONFormatter(targetJson);

          setTimeout(() => {
            if (refJsonContent.value) {
              refJsonContent.value.innerHTML = '';
              refJsonContent.value.append(formatter.render());
            }
            copyMessage();
          });
        }

        if (props.message.type === MessageContentType.KEY_VALUE) {
          setTimeout(() => {
            copyMessage();
            copyValueItem();
          });
        }

        emit('detail', toolOperation.isDetailShow, props.id);
      }
    };

    const fixMesage = (_e: MouseEvent, isFix?: boolean) => {
      toolOperation.isFix = isFix ?? !toolOperation.isFix;
    };

    const addMouseKeyEvent = (remove = false) => {
      const isAdvance = typeof props.message === 'object' && !isVNode(props.message);
      if (!isAdvance) {
        return;
      }

      if (remove) {
        document.removeEventListener('keydown', handleMouseKeyEvent);
        return;
      }

      document.addEventListener('keydown', handleMouseKeyEvent);
    };

    const handleMouseKeyEvent = e => {
      if (e.altKey && e.keyCode === 80) {
        fixMesage(e);
      }
    };

    onMounted(() => {
      timerDelay.value && startTimer();
      visible.value = true;
      addMouseKeyEvent();
    });

    onUnmounted(() => {
      clearTimeout(timer);
      addMouseKeyEvent(true);
    });

    watch(visible, () => {
      if (!visible.value) {
        emit('destroy', props.id);
      }
    });

    const handleMouseenter = (_e: MouseEvent) => {
      clearTimeout(timer);
    };

    const handleMouseleave = (_e: MouseEvent) => {
      timerDelay.value && startTimer();
    };

    const handleHeplerClick = (_e: MouseEvent) => {
      if ((props.message as IMessage).assistant) {
        window.open((props.message as IMessage).assistant, '_blank');
      }
    };

    const defActionList = computed(() => ({
      [IMessageActionType.ASSISTANT]: {
        id: IMessageActionType.ASSISTANT,
        icon: () => <Assistant></Assistant>,
        text: () => t.value.assistant,
        onClick: (e: MouseEvent) => handleHeplerClick(e),
      },
      [IMessageActionType.DETAILS]: {
        id: IMessageActionType.DETAILS,
        icon: () => (toolOperation.isDetailShow ? <AngleDoubleUpLine /> : <AngleDoubleDownLine />),
        text: () => t.value.details,
        onClick: (e: MouseEvent) => setDetailsShow(e),
      },
      [IMessageActionType.FIX]: {
        id: IMessageActionType.FIX,
        icon: () => (toolOperation.isFix ? <FixShape></FixShape> : <FixLine></FixLine>),
        classList: toolOperation.isFix ? 'fixed' : '',
        onClick: (e: MouseEvent) => fixMesage(e),
      },
      [IMessageActionType.CLOSE]: {
        id: IMessageActionType.CLOSE,
        classList: 'normal-color',
        icon: () =>
          props.dismissable && (
            <Error
              class={`${resolveClassName('message-close')}`}
              onClick={close}
            />
          ),
        onClick: close,
      },
    }));

    const sortActionIdList = [
      IMessageActionType.ASSISTANT,
      IMessageActionType.DETAILS,
      IMessageActionType.FIX,
      IMessageActionType.CLOSE,
    ];

    const actionList = computed(() => {
      if (props.actions?.length > 0) {
        const resultList = props.actions.map(action => {
          const id = action.id.toLocaleLowerCase();
          const defAction: IMessageAction = defActionList.value[id];
          const defClickFn = defAction?.onClick;
          const target = Object.assign({}, defActionList.value[id] || {}, action);
          target.id = id;

          if (action.classList !== undefined) {
            const classList = Array.isArray(action.classList) ? action.classList : [action.classList];
            let defClassList = [];
            if (defAction.classList !== undefined) {
              defClassList = Array.isArray(defAction.classList) ? defAction.classList : [defAction.classList];
            }

            target.classList = [...defClassList, ...classList];
          }

          if (typeof action.onClick === 'function') {
            target.onClick = () => {
              const resp = Reflect.apply(action.onClick, this, []);
              if ((typeof resp === undefined || resp) && typeof defClickFn === 'function') {
                Reflect.apply(defClickFn, this, []);
              }
            };

            return target;
          }

          target.onClick = defClickFn;
          return target;
        });
        const appendList = sortActionIdList
          .filter(id => !resultList.some(action => action.id === id))
          .map(id => defActionList.value[id]);
        resultList.push(...appendList);
        return resultList;
      }

      return sortActionIdList.map(id => defActionList.value[id]);
    });

    const renderMessageActions = () => {
      const renderIcon = ({ icon }: IMessageAction) => {
        if (typeof icon === 'function') {
          return Reflect.apply(icon, this, []);
        }

        return <span class={icon}></span>;
      };

      const renderText = ({ text }: IMessageAction) => {
        let content = undefined;
        if (typeof text === 'function') {
          content = Reflect.apply(text, this, []);
        }

        if (content === undefined) {
          return;
        }

        if (typeof content === 'string') {
          return <span class='message-action-text'>{content}</span>;
        }

        return content;
      };

      const handleActionClick = (e, action: IMessageAction) => {
        if (action.readonly || action.disabled) {
          return;
        }

        if (typeof action.onClick === 'function') {
          Reflect.apply(action.onClick, this, [e, action]);
        }
      };

      const renderActionList = () =>
        actionList.value.map(action => {
          if (action.disabled) {
            return null;
          }

          if (typeof action.render === 'function') {
            return Reflect.apply(action.render, this, []);
          }

          const classList = Array.isArray(action.classList) ? action.classList.join(' ') : action.classList;

          return (
            <span
              class={['tool', action.id, classList]}
              onClick={e => handleActionClick(e, action)}
            >
              {renderIcon(action)}
              {renderText(action)}
            </span>
          );
        });

      return slots.action?.() ?? renderActionList();
    };

    expose({
      setDetailsShow,
    });

    return {
      classNames,
      styles,
      visible,
      close,
      setDetailsShow,
      fixMesage,
      copyMessage,
      parseToJson,
      handleMouseenter,
      handleMouseleave,
      renderMessageActions,
      refJsonContent,
      refCopyStatus,
      refCopyMsgDiv,
      toolOperation,
      copyStatus,
      t,
      resolveClassName,
      copyValueItem,
    };
  },
  render() {
    const renderIcon = (theme?) => {
      const iconMap = {
        primary: <Info></Info>,
        warning: <Warn></Warn>,
        success: <Success></Success>,
        error: <Close></Close>,
      };
      return iconMap[theme ?? this.theme];
    };

    const renderMsgDetail = (msg: IMessage) => {
      if (msg.type === MessageContentType.KEY_VALUE) {
        const target = this.parseToJson(msg.details || {});
        const keys = Object.keys(target);
        return keys.map(key => (
          <div class='message-row'>
            <label>{key}</label>
            <span class='copy-value'>{target[key]}</span>
          </div>
        ));
      }
    };

    const renderMessage = () => {
      if (typeof this.message === 'object' && !isVNode(this.message)) {
        return (
          <div class={`${this.resolveClassName('message-content')} multi`}>
            <div class='overview'>
              <div class='left-content'>
                <div class={`${this.resolveClassName('message-icon')}`}>{renderIcon()}</div>
                <div class='describe'>
                  {this.$slots.title?.() ??
                    `【${this.message.code}】${this.message.overview} ${this.message.suggestion}`}
                </div>
              </div>
              <div class='tools'>{this.renderMessageActions()}</div>
            </div>
            {this.toolOperation.isDetailShow && (
              <div class='message-detail'>
                <div
                  ref='refCopyMsgDiv'
                  class='message-copy'
                >
                  <CopyShape></CopyShape>
                </div>
                <div
                  ref='refCopyStatus'
                  class='copy-status'
                >
                  <div class='inner'>
                    {renderIcon(this.copyStatus)}
                    {this.copyStatus === 'success' ? this.t.copySuccess : this.t.copyFailed}
                  </div>
                </div>
                <div
                  ref='refJsonContent'
                  class='message-tree'
                >
                  {renderMsgDetail(this.message)}
                </div>
              </div>
            )}
          </div>
        );
      }

      return (
        <>
          <div class={`${this.resolveClassName('message-content')}`}>
            <div class={`${this.resolveClassName('message-icon')}`}>{renderIcon()}</div>
            {this.message}
          </div>
          {this.dismissable && (
            <Error
              class={`${this.resolveClassName('message-close')}`}
              onClick={this.close}
            />
          )}
        </>
      );
    };

    return (
      <Transition name='bk-message-fade'>
        <div
          style={this.styles as StyleValue}
          class={this.classNames}
          v-show={this.visible}
          onMouseenter={this.handleMouseenter}
          onMouseleave={this.handleMouseleave}
        >
          {renderMessage()}
        </div>
      </Transition>
    );
  },
});

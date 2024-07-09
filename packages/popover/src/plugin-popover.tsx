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
import { createApp, reactive, ref } from 'vue';

import Popover from './popover';
import { PopoverProps, PopoverPropTypes } from './props';
import { isAvailableId, isElement } from './utils';

export type $Popover = PopoverPropTypes & {
  target: HTMLElement | HTMLElement | MouseEvent;
  immediate: boolean;
};

export default function createPopoverComponent(options: $Popover) {
  let $PopoverInstance = null;
  let $PopoverInstanceVm = null;
  let $PopoverInstanceEl: HTMLElement = null;
  const immediate = options.immediate ?? true;
  const resolvedOptions: any = {
    boundary: 'body',
    placement: 'top',
    autoVisibility: true,
    isShow: false,
    trigger: 'manual',
    onHide: () => {},
    onShow: () => {},
    ...options,
    allowHtml: true,
  };

  const popoverComponent = {
    name: '$popover',
    setup(_, { expose }) {
      const formatOptions = (): any =>
        Object.keys(PopoverProps).reduce(
          (result: any, key) => {
            if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
              Object.assign(result, { [key]: resolvedOptions[key] });
            }

            return result;
          },
          { target: resolvedOptions.target },
        );

      const refProps = reactive(formatOptions());
      const refReference = ref();
      const show = () => {
        refReference.value?.show?.();
      };

      const hide = () => {
        refReference.value?.hide?.();
      };

      const stopHide = () => {
        refReference.value?.stopHide?.();
      };

      const updateTarget = (target: HTMLElement | MouseEvent) => {
        refProps.target = target;
        refReference.value?.resetPopover?.();
      };

      const handleContentMouseenter = () => {
        resolvedOptions.onContentMouseenter?.();
      };

      const handleContentMouseleave = () => {
        resolvedOptions.onContentMouseleave?.();
      };

      const handlePopoverHidden = () => {
        resolvedOptions.onHide?.();
      };

      const handlePopoverShow = () => {
        resolvedOptions.onShow?.();
      };

      expose({
        show,
        hide,
        updateTarget,
        stopHide,
      });

      return () => (
        <Popover
          {...refProps}
          ref={refReference}
          onAfterHidden={handlePopoverHidden}
          onAfterShow={handlePopoverShow}
          onContentMouseenter={handleContentMouseenter}
          onContentMouseleave={handleContentMouseleave}
        ></Popover>
      );
    },
  };

  function getBoundaryDom(boundary) {
    if (/^body$/i.test(boundary)) {
      return document.body;
    }

    if (/^parent$/i.test(boundary)) {
      if (isElement(resolvedOptions.target)) {
        return (resolvedOptions.target as HTMLElement).parentNode;
      }
      return ((resolvedOptions.target as MouseEvent).target as HTMLElement).parentNode;
    }

    if (typeof boundary === 'string' && isAvailableId(boundary)) {
      return document.querySelector(boundary);
    }

    return document.body;
  }

  const install = () => {
    if ($PopoverInstance === null) {
      $PopoverInstanceEl = document.createElement('div');
      getBoundaryDom(resolvedOptions.boundary).append($PopoverInstanceEl);

      $PopoverInstance = createApp(popoverComponent);
      $PopoverInstanceVm = $PopoverInstance.mount($PopoverInstanceEl);
    }
  };

  const uninstall = () => {
    if (isElement(options.content)) {
      (options.content as HTMLElement).remove();
    }
    $PopoverInstance.unmount();
    $PopoverInstance = null;
    $PopoverInstanceEl?.remove();
  };

  function close() {
    uninstall();
    $PopoverInstanceVm = null;
  }

  function show(target?: HTMLElement | MouseEvent) {
    install();
    if (target) {
      ($PopoverInstanceVm as any)?.updateTarget(target);
    }

    ($PopoverInstanceVm as any)?.show();
  }

  function update(e: MouseEvent) {
    ($PopoverInstanceVm as any)?.updateTarget(e);
  }

  function hide() {
    ($PopoverInstanceVm as any)?.hide();
  }

  immediate && install();

  return {
    install,
    close,
    show,
    hide,
    update,
    uninstall,
    get vm() {
      return $PopoverInstanceVm;
    },
    get $el(): HTMLElement {
      return $PopoverInstanceVm.$el;
    },
  };
}

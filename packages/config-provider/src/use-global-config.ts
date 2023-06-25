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

import { merge } from 'lodash';
import { computed, ComputedRef, inject, provide, reactive, watch } from 'vue';

import { ConfigProviderProps } from './config-provider';
import { defaultRootConfig, rootProviderKey } from './token';

export const setPrefixVariable = (prefix: string) => {
  document.documentElement.style.setProperty('--bk-prefix', prefix || defaultRootConfig.prefix);
};

export const provideGlobalConfig = (config: ConfigProviderProps) => {
  const configData = reactive({
    ...merge(defaultRootConfig, config),
  });

  Object.keys(config).forEach((key) => {
    watch(
      () => config[key],
      () => {
        if (key === 'prefix') setPrefixVariable(config[key]);
        configData[key] = config[key];
      },
    );
  });
  provide(rootProviderKey, configData);
};

export const useGlobalConfig = (): ComputedRef<ConfigProviderProps> => {
  const config = inject<ConfigProviderProps>(rootProviderKey, defaultRootConfig);
  return computed(() => config);
};

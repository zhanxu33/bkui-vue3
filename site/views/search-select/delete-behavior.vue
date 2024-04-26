<template>
  <div class="delete-behavior-demo">
    <div>配置为 delete-value 删除光标所在的value的所有字符</div>
    <bk-search-select
      v-model="value2"
      :data="data"
      delete-behavior="delete-value"
    />
    <div>配置为 delete-char 删除单个字符</div>
    <bk-search-select
      v-model="value"
      :data="data"
      delete-behavior="delete-char"
    />
  </div>
</template>
<script setup>
import { ref, shallowRef } from 'vue';
function generateRandomIPs(count) {
  const generateIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  const ipList = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: generateIP(),
  }));
  return ipList;
}
const ipList = generateRandomIPs(20);
function generateRandomValues(count) {
  const arrayCopy = ipList.slice();
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy.slice(0, count);
}
const data = shallowRef([
  {
    name: 'IP地址',
    id: '3',
    multiple: true,
    children: ipList,
  },
  {
    name: '实例状态',
    id: '1',
    multiple: true,
    children: [
      {
        name: 'redis 创 建 中 ',
        id: '1-2',
      },
      {
        name: '运行中',
        id: '1-3',
      },
      {
        name: '已关机',
        id: '1-4',
      },
    ],
  },
  {
    name: '实例业务',
    id: '2',
    children: [
      {
        name: '王者荣耀',
        id: '2-1',
        disabled: false,
      },
      {
        name: '刺激战场',
        id: '2-2',
      },
      {
        name: '绝地求生',
        id: '2-3',
      },
    ],
  },
]);
const value = ref([{ name: 'IP地址', id: '3', values: generateRandomValues(6) }]);
const value2 = ref([{ name: 'IP地址', id: '3', values: generateRandomValues(6) }]);
</script>
<style lang="less">
.delete-behavior-demo {
  display: flex;
  flex-direction: column;

  .bk-search-select {
    margin: 15px 0;
  }
}
</style>

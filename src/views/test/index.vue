<template>

  <div class="block">
    <span class="demonstration">hover 触发子菜单</span>
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ expandTrigger: 'hover' }"
      @change="handleChange"></el-cascader>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        value: [],
        options: [
          {
          value: 'zhinan',
          label: '指南',
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]
      };
    },
    methods: {
      handleChange(value) {
        console.log(value);
      }
    }
  };
</script>

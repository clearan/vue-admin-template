<template>
  <div class="dashboard-container">
    cc
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'index',
    computed: {
      ...mapGetters([
        'name'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>

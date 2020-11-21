<template>
  <div class='layout_bg'>
    <el-container class='conta'>
      <el-aside width="200px">
          <v-aside></v-aside>
      </el-aside>
      <el-container>
        <el-header class='header'>
            <v-header></v-header>
        </el-header>
        <el-main class='main1'>
                <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import VAside from '@/components/aside.vue'
import VHeader from '@/components/header'

export default {
    components : {
        VAside,
        VHeader
    }
};

</script>
<style lang="stylus">
.layout_bg{
    height  100%
    .conta{
        height 100%
    }
    .header{
        background #b3c0d1
    }
    .main1{
        background #e5e5e5
    }
}
</style>
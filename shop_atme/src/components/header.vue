<template>
  <div class="lo_header" >
    <el-dropdown @command='commandFn'>
      <span class="el-dropdown-link">
        {{username}}
        <i class="el-icon-setting el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import {mapMutations,mapGetters} from 'vuex';
export default {
    computed: {
        ...mapGetters(['username'])
    },
    methods: {
        ...mapMutations(['logout']),
        commandFn(){
            this.logout()
        }
    },
};
</script>
<style lang="stylus">
.lo_header{
    height 60px
    line-height 60px
    text-align right 
}
</style>
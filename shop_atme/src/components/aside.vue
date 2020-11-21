<template>
  <div class="aside">
    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <h2 class="aside_nav">后台管理系统</h2>
      <el-menu-item>
        <router-link to="/index" index="index">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </router-link>
      </el-menu-item>
      <!-- 子菜单 -->
      <el-submenu v-for="(submenu,index) in menus" :key="index" :index="(index+1).toString()">
        <template slot="title">
          <i :class="submenu.icon"></i>
          <span>{{submenu.title}}</span>
        </template>
        <el-menu-item v-for="(item,index) in submenu.children" :key="index" :index="item.url">
          <router-link :to="item.url" index="index">
            <i :class="item.incon"></i>
            <span>{{item.title}}</span>
          </router-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["menus"])
  }
};
</script>

<style lang="stylus">
.aside {
    height 100%
    background #545c64
  .aside_nav {
    font-size: 20px;
    color: #fff;
    text-align: center;
    font-weight: normal;
    height: 60px;
    line-height: 60px;
  }

  .el-menu-item {
    .router-link-active {
      color: #ffd04b;

      i {
        color: #ffd04b;
      }
    }
  }

  a {
    color: #fff;
    text-decoration: none;
  }
}
</style>
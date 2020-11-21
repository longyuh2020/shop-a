<template>
  <div class="menus">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <v-table :tableData="tableData" :htr='htr' @edit="edit" :total="total"></v-table>
    <v-dialog :info="info" @getTable="getTable" ref="dialog"></v-dialog>
  </div>
</template>
<script>
import VTable from "./member/table.vue";
import VDialog from "./member/dialog.vue";
export default {
  components: {
    VTable,
    VDialog
  },
  data() {
    return {
      tableData: [],
      info: {
        isShow: false, //对话框
      },
      htr: {
        page: 1,
        size: 2
      },
      total : 0
    };
  },
  methods: {
    //获取树形数据
    async getTable() {
      let res = await this.$http.get("/api/memberlist",this.htr);
      console.log(res);
      this.total = res.list.length;
      if (res.code == 200) {
        this.tableData = res.list;
      } else {
        this.message.error(res.msg);
      }
    },
    //编辑
    async edit(uid) {
      this.info = {
        isShow: true,
      };
      let res = await this.$http.get("/api/memberinfo", { uid });
      console.log(res)
      if (res.code == 200) {
        this.$refs.dialog.form = {
          uid,
          status: res.list.status == 1 ? true : false,
          nickname : res.list.nickname,
          phone : res.list.phone
        };
      }
    },
  },
  created() {
    this.getTable();
  }
};
</script>
<style lang="stylus">
.menus {
  .btn {
    margin: 18px 0 10px;
  }
}
</style>
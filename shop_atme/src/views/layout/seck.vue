<template>
  <div class="menus">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" class="btn" @click="addFn">添加</el-button>
    <v-table :tableData="tableData" @edit="edit" @del="del"></v-table>
    <v-dialog :info="info" @getTable="getTable" ref="dialog"></v-dialog>
  </div>
</template>
<script>
import VTable from "./seck/table.vue";
import VDialog from "./seck/dialog.vue";
import axios from "axios";
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
        isAdd: true, //添加或编辑
      }
    };
  },
  methods: {
    //获取树形数据
    async getTable() {
      let res = await axios.get("/api/secklist");
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      } else {
        this.message.error(res.msg);
      }
    },
    addFn() {
      this.info.isShow = true;
    },
    //编辑
    async edit(id) {
      this.info = {
        isShow: true,
        isAdd: false
      };
      let res = await this.$http.get("/api/seckinfo", { id });
      console.log(res)
      if (res.code == 200) {
        this.$refs.dialog.form = {
          ...res.list,
          id,
          status : res.list.status==1?true:false
        };
        this.$refs.dialog.arrT = [new Date(parseInt(res.list.begintime)),new Date(parseInt(res.list.endtime))]
        this.$refs.dialog.getCateList(res.list.first_cateid);
        this.$refs.dialog.getSecondList(res.list.first_cateid,res.list.second_cateid);
      }
    },
    //删除
    del(data) {
      this.tableData = data;
    }
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
<template>
  <div>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id">
      <el-table-column prop="title" label="名称" width="180"></el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["tableData"],
  methods: {
    editFn(id) {
      this.$emit("edit", id);
    },
    //点击删除
    deleFn(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //点击确定
          let res = await this.$http.post("/api/bannerdelete", { id });
          if (res.code == 200) {
            this.$message.success("删除成功");
            // 触发自定义事件，后台服务器返回的删除成功后的数据传递个父组件，更新tableData
            this.$emit("del", res.list);
          }
        })
        .catch(() => {
          //点击取消
        });
    }
  }
};
</script>
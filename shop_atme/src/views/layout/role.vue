<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn" class="btn">添加</el-button>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id">
      <el-table-column prop="rolename" label="名称" width="180"></el-table-column>
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

    <!-- 弹窗 -->
    <el-dialog
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'新增菜单':'编辑菜单'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            check-strictly
            ref="tree"
            :props="{
              label : 'title',
              children : 'children'
            }"
            :default-checked-keys="defeKeys"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultForm = {
  rolename: "",
  menus: "",
  status: true
};
export default {
  data() {
    return {
      //选中数组
      defeKeys: [],
      tableData: [],
      menuList: [],
      info: {
        isShow: false,
        isAdd: true
      },
      form: {
        ...defaultForm
      },
      rules: {
        rolename: [
          {
            required: true, //必填
            message: "请输入菜单名称", //提示信息
            trigger: "blur" //触发条件
          }
        ]
      }
    };
  },
  methods: {
    async getTable() {
      let res = await this.$http.get("/api/rolelist");
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    addFn() {
      this.info.isShow = true;
    },
    openFn() {
      this.getMenu();
    },
    submitFn() {
      //获取 被选中项 node-key 组成的数组
      // console.log(this.$refs.tree.getCheckedKeys());
      this.$refs.ruleForm.validate(async value => {
        console.log(value);
        if (value) {
          let url = this.info.isAdd ? "/api/roleadd" : "/api/roleedit";
          //转为字符串
          this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
          this.form.status = this.form.status ? 1 : 2;
          let res = await this.$http.post(url, this.form);
          console.log(res);
          if (res.code == 200) {
            this.getTable();
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },
    resetFn() {
      this.form = {
        ...defaultForm
      };
      this.info.isAdd = true;

      this.defeKeys = [];
    },
    //获取菜单权限列表
    async getMenu() {
      let res = await this.$http.get("/api/menulist", { istree: true });
      console.log(res);
      this.menuList = res.list ? res.list : [];
    },
    //删除
    deleFn(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该角色, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$http.post("/api/roledelete", { id });
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.tableData = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    //编辑
    async editFn(id) {
      this.info.isShow = true;
      this.info.isAdd = false;
      let res = await this.$http.get("/api/roleinfo", { id });
      console.log(res);
      this.form.rolename = res.list.rolename;
      this.form.status = res.list.status == 1 ? true : false;
      this.form.id = id;
      //选中项
      this.defeKeys = res.list.menus.split(",");
    }
  },
  created() {
    this.getTable();
  }
};
</script>
<style lang="stylus">
.btn {
  margin: 10px 0;
}
</style>
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn" class="btn">添加</el-button>

    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id">
      <el-table-column prop="uid" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="rolename" label="角色" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="danger" effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button type="danger" @click="deleFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
        background :带背景颜色
        layout ：分页器结构，prev后退, pager 点击翻页, next前进
        page-size:每页条数
        current-page：当前页数
        total:总条数
    -->
    <el-pagination
      background
      :page-size="size"
      :current-page.sync="page"
      layout="prev, pager, next"
      :total="total"
      @current-change="pageChange"
    ></el-pagination>

    <!-- 弹窗 -->
    <el-dialog
      @open="openFn"
      @close="resetFn"
      :title="info.isAdd?'管理员添加':'管理员编辑'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="角色" prop="rolename">
          <el-select v-model="form.roleid">
            <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
            -->
            <el-option
              v-for="(item,index) in roleList"
              :key="index"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
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
import axios from "axios";
let defaultForm = {
  roleid: "",
  username: "",
  password: "",
  status: true
};
export default {
  data() {
    return {
      tableData: [],
      roleList: [],
      //分页器
      page: 1,
      size: 2,
      total: 0,
      info: {
        isShow: false,
        isAdd: true
      },
      form: {
        ...defaultForm
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入管理员名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //请求表格数据的promise对象
    getList() {
      return this.$http.get("/api/userlist", {
        page: this.page,
        size: this.size
      });
    },
    //总条数的promise对象
    getTotal() {
      return this.$http.get("/api/usercount");
    },
    //并发请求
    getTableData() {
      // all 接受 axios promise对象组成的数组作为参数
      axios.all([this.getList(), this.getTotal()]).then(
        axios.spread((tableData, total) => {
          console.log(tableData);
          if (tableData.code == 200 && total.code == 200) {
            this.tableData = tableData.list ? tableData.list : [];
            this.total = total.list ? total.list[0].total : 0;
          } else {
          }
        })
      );
    },
    //获取角色列表
    async getroList() {
      let res = await this.$http.get("/api/rolelist");
      console.log(res);
      if (res.code == 200) {
        this.roleList = res.list;
      }
    },
    pageChange(cur){
        console.log(cur)
        this.page = cur;
        this.getTableData()
    },
    addFn() {
      this.info.isShow = true;
    },
    //编辑
    async editFn(uid) {
        console.log(uid)
        this.info.isShow = true;
        this.info.isAdd = false;

        let res = await this.$http.get('/api/userinfo',{uid})
        console.log(res)
        if(res.code==200){
            this.form.uid = res.list.uid;
            this.form.status = res.list.status==1?true:false;
            this.form.username = res.list.username;
            this.form.roleid = res.list.roleid;
        }
    },
    //删除
    async deleFn(id) {
        try{
            await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            let res = await this.$http.post("/api/userdelete",{id})
            console.log(res)
            if(res.code==200){
                // 删除后退回第一页
                this.page = 1;
                this.getTableData();
            }
        }catch(error){
            
        }
    },
    //提交
    submitFn() {
      this.$refs.ruleForm.validate(async value => {
        if (value) {
            let url = this.info.isAdd?'/api/useradd':'/api/useredit';
            this.form.status = this.form.status?1:2;
            let res = await this.$http.post(url,this.form);
            console.log(res)
            if(res.code==200){
                this.$message.success(res.msg);
                this.getTableData()
            }else{
                this.$message.error(res.msg);
            }
            this.info.isShow = false
        }
      });
      console.log(this.form);
    },
    openFn() {
      this.getroList();
    },
    resetFn() {
        this.info.isAdd=true;
        this.form = {
            ...defaultForm
        }
    }
  },
  created() {
    this.getTableData();
  }
};
</script>
<style lang="stylus">
.btn {
  margin: 10px 0;
}
</style>
<template>
  <el-dialog
    @open="openFn"
    @close="resetFn"
    :title="info.isAdd?'新增菜单':'编辑菜单'"
    :visible.sync="info.isShow"
  >
    <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
      <el-form-item label="菜单名称">
        <el-select v-model="form.pid" @change="changeMenu" > 
          <el-option label="顶级菜单" :value="0"></el-option>
          <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
          -->
          <el-option
            v-for="(item,index) in topMenus"
            :key="index"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type==1" label="目录图标">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item v-else label="菜单地址">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio v-model="form.type" :disabled="form.type==2" :label="1">目录</el-radio>
        <el-radio v-model="form.type" :disabled="form.type==1" :label="2">菜单</el-radio>
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
</template>
<script>
import axios from "axios";
let dealutForm = {
  pid: 0,
  title: "",
  type: 1,
  icon: "",
  url: "",
  status: true
};
export default {
  data() {
    return {
      form: {
        ...dealutForm
      },
      v:'',
      //顶级菜单列表
      topMenus: [],
      //验证规格
      rules: {
        title: [
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
    //关闭对话框触发事件
    resetFn() {
      this.form = {
        ...dealutForm
      };
      //重置对话框状态
      this.info.isAdd = true;
    },
    //提交
    submitFn() {
      this.$refs.ruleForm.validate(async value => {
        if (value) {
          // 利用 isAdd 判断 提交的接口地址
          let url = this.info.isAdd ? "/api/menuadd" : "/api/menuedit";
          this.form.status = this.form.status ? 1 : 2;
          let res = await this.$http.post(url, this.form);
          if (res.code == 200) {
            this.$emit("getTable");
          } else {
            this.$message.error(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },
    //value改变
    changeMenu(value) {
      this.form.type = value == 0 ? 1 : 2;
    },
    //获取顶级菜单
    async getTop() {
      let res = await axios.get("/api/menulist", { params: { pid: 0 } });
      console.log(res);
      if (res.code == 200) {
        this.topMenus = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    openFn() {
      this.getTop();
    }
  },
  props: ["info"]
};
</script>
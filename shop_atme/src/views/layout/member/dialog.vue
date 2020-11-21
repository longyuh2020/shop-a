<template>
  <el-dialog
    @close="resetFn"
    title="编辑菜单"
    :visible.sync="info.isShow"
  >
    <el-form :model="form" label-width="100px" ref="ruleForm">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone"></el-input>
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
</template>
<script>
import axios from "axios";
let dealutForm = {
  status: true,
  uid : '',
  nickname : '',
  phone : '',
  password : ''
};
export default {
  data() {
    return {
      form: {
        ...dealutForm
      },
    
    };
  },
  methods: {
    //关闭对话框触发事件
    resetFn() {
      this.form = {
        ...dealutForm
      };
    },
    //提交
    async submitFn() {
          let url = '/api/memberedit'
          this.form.status = this.form.status ? 1 : 2;
          let res = await this.$http.post(url, this.form);
          if (res.code == 200) {
            this.$emit("getTable");
          } else {
            this.$message.error(res.msg);
          }
          this.info.isShow = false;
    
    },
  },
  props: ["info"]
};
</script>
<template>
  <el-dialog
    @open="openFn"
    @close="resetFn"
    :title="info.isAdd?'新增菜单':'编辑菜单'"
    :visible.sync="info.isShow"
  >
    <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
      <el-form-item label="轮播图标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <!-- 
            el-upload:上传组件
            action: 自动上传地址
            on-preview:出现预览按钮，响应点击预览事件
            on-change: 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        -->
        <el-upload
          ref="file"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-change="picChange"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
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
  title: "",
  img: "",
  status: true
};
export default {
  data() {
    return {
      form: {
        ...dealutForm
      },
       dialogVisible: false, //预览图显示状态
        dialogImageUrl: "", //预览图地址
        fileList: [], //上传文件列表
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
      this.$refs.file.clearFiles();
      this.info.isAdd = true;
      this.dialogVisible = false;
      this.dialogImageUrl = "";
      this.form = {
        ...dealutForm
      }
    },
    //提交
    submitFn() {
      this.$refs.ruleForm.validate(async value => {
        if (value) {
          // 利用 isAdd 判断 提交的接口地址
          let url = this.info.isAdd ? "/api/banneradd" : "/api/banneredit";
          this.form.status = this.form.status ? 1 : 2;
          let res = await this.$http.upload(url, this.form);
          if (res.code == 200) {
            this.$emit("getTable");
            this.$message.success('添加成功');
          } else {
            this.$message.error(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },
    handlePreview() {
      this.dialogVisible = true;
       console.log(this.dialogVisible)
    },
    picChange(file, fileList) {
      this.form.img = file.raw;
      //地址
      this.dialogImageUrl = file.url;
    },
    openFn() {}
  },
  props: ["info"]
};
</script>
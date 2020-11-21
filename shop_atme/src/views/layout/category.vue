<template>
  <div class="menus">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" class="btn" @click="addFn">添加</el-button>

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="catename" label="分类名称" width="180"></el-table-column>
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
      :title="info.isAdd?'分类添加':'分类编辑'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="角色">
          <el-select v-model="form.pid">
            <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
            -->
            <el-option
              v-for="(item,index) in cateList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="form.catename"></el-input>
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
            :file-list="info.fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="info.dialogVisible" append-to-body>
            <img width="100%" :src="info.dialogImageUrl" alt />
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
  </div>
</template>
<script>
let defaultForm = {
  pid: "",
  catename: "",
  status: true,
  img: ""
};
export default {
  data() {
    return {
      tableData: [],
      cateList: [],
      info: {
        isShow: false,
        isAdd: true,
        dialogVisible: false, //预览图显示状态
        dialogImageUrl: "", //预览图地址
        fileList: [] //上传文件列表
      },
      form: {
        ...defaultForm
      },
      rules: {
        catename: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 添加上传图片触发的钩子
    // file:被上传的文件信息
    // fileList:被上传的文件信息列表
    picChange(file, fileList) {
      this.form.img = file.raw;
      console.log(file)
      //地址
      this.info.dialogImageUrl = file.url;
    },
    handlePreview() {
      console.log("在预览");

      this.info.dialogVisible = true;
    },
    async getTableData() {
      let res = await this.$http.get("/api/catelist", { istree: true });
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    async getCateList() {
      let res = await this.$http.get("/api/catelist", { pid: 0 });
      if (res.code == 200) {
        console.log(res);
        this.cateList = res.list;
      }
    },
    addFn() {
      this.info.isShow = true;
    },
    async submitFn() {
      this.$refs.ruleForm.validate(async value => {
        console.log(value);
        if (value) {
          this.form.status = this.form.status ? 1 : 2;
          let url = this.info.isAdd ? "/api/cateadd" : "/api/cateedit";
          console.log(this.form);
          let res = await this.$http.upload(url, this.form);
          if (res.code == 200) {
            console.log(res);
            this.getTableData();
            this.$message.success(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },
    async editFn(id) {
       this.info.isShow = true;
       this.info.isAdd = false;
        let res = await this.$http.get("/api/cateinfo",{id});
        
        console.log(res);
        if(res.code ==200){
              this.form.id = id;
            this.form.pid = res.list.pid;
            this.form.status = res.list.status==1?true:false;
            this.form.catename = res.list.catename;
            /* 设置上传文件列表 */
            // this.info.fileList = [{name:"",url:"https://imgm.gmw.cn/attachement/jpg/site215/20201113/5114833073091398003.jpg"}];
            //  图片地址是相对于后台服务器的localhost:3000相对地址，需要转化为绝对地址
            this.info.fileList = [{name:"",url:'http://localhost:3000'+res.list.img}]  
             this.info.dialogImageUrl='http://localhost:3000'+res.list.img;
        }
    },
    deleFn(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$http.post("/api/catedelete", { id });
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.tableData = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    openFn() {
      this.getCateList();
    },
    resetFn() {
       // 清除上传文件列表
      this.$refs.file.clearFiles();
      this.info.isAdd = true;
      this.info.dialogVisible = false;
      this.info.dialogImageUrl = "";
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
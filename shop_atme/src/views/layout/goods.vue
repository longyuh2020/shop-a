<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn" class="btn">添加</el-button>

    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id">
      <el-table-column prop="firstcatename" label="一级分类" width="180"></el-table-column>
      <el-table-column prop="secondcatename" label="二级分类" width="180"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="price" label="售价" width="180"></el-table-column>
      <el-table-column prop="market_price" label="市场价" width="180"></el-table-column>
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
      @opened="openedFn"
      :title="info.isAdd?'商品添加':'商品编辑'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" label-width="100px" ref="ruleForm">
        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change="firstChange">
            <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
            -->
            <el-option
              v-for="(item,index) in firstCateList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid">
            <el-option
              v-for="(item,index) in secondCateList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="分类图片">
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
        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="specsChange">
            <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
            -->
            <el-option
              v-for="(item,index) in specsList"
              :key="index"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格值">
          <el-select v-model="form.specsattr" multiple>
            <el-option
              v-for="(item,index) in specsAttrList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="form.market_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-radio v-model="form.status" :label="1">上架</el-radio>
          <el-radio v-model="form.status" :label="2">下架</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
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
import E from "wangeditor";
let defaultForm = {
  first_cateid: "",
  second_cateid: "",
  goodsname: "",
  price: "",
  market_price: "",
  img: "",
  description: "",
  specsid: "",
  specsattr: "",
  isnew: 1,
  ishot: 1,
  status: 1
};
export default {
  data() {
    return {
      // 一级分类
      firstCateList: [],
      secondCateList: [],
      // 属性列表
      specsList: [],
      // 属性值列表
      specsAttrList: [],
      tableData: [],
      roleList: [],
      //分页器
      page: 1,
      size: 2,
      total: 0,
      info: {
        isShow: false,
        isAdd: true,
        dialogVisible: false, //预览图显示状态
        dialogImageUrl: "", //预览图地址
        fileList: [] //上传文件列表
      },
      form: {
        ...defaultForm
      }
    };
  },
  methods: {
    // 添加上传图片触发的钩子
    // file:被上传的文件信息
    // fileList:被上传的文件信息列表
    picChange(file, fileList) {
      this.form.img = file.raw;
      //地址
      this.info.dialogImageUrl = file.url;
    },
    handlePreview() {
      console.log("在预览");
      this.info.dialogVisible = true;
    },
    //请求表格数据的promise对象
    getList() {
      return this.$http.get("/api/goodslist", {
        page: this.page,
        size: this.size
      });
    },
    //总条数的promise对象
    getTotal() {
      return this.$http.get("/api/goodscount");
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
    //获取分类列表
    async getCateList(pid = 0) {
      let res = await this.$http.get("/api/catelist", { pid });
      console.log(res);
      if (pid == 0) {
        if (res.code == 200) {
          this.firstCateList = res.list;
        }
      } else {
        //二级分类
        if (res.code == 200) {
          this.secondCateList = res.list;
        }
      }
    },
    //获取属性
    async getSpecsList() {
      let res = await this.$http.get("/api/specslist");
      if (res.code == 200) {
        this.specsList = [...res.list];
      }
    },
    specsChange(id) {
      //找对应属性值
      let item = this.specsList.find(item => item.id == id);
      console.log(item);
      this.specsAttrList = [...item.attrs];
    },
    pageChange(cur) {
      console.log(cur);
      this.page = cur;
      this.getTableData();
    },
    firstChange(id) {
      this.getCateList(id);
    },
    addFn() {
      this.info.isShow = true;
    },
    //编辑
    async editFn(id) {
      console.log(id);
      this.info.isShow = true;
      this.info.isAdd = false;

      let res = await this.$http.get("/api/goodsinfo", { id });
      console.log(res);
      if (res.code == 200) {
        this.form = {
          ...res.list,
          id
        };
        this.info.fileList = [
          {
            name: "",
            url: "http://localhost:3000" + res.list.img
          }
        ];
         this.info.dialogImageUrl = "http://localhost:3000" + res.list.img;
        // 先获取属性列表，再获取属性值列表
        // 异步操作的不确定性
        let res1 = await this.$http.get('/api/specslist');
        if(res1.code==200){
          console.log(res1.list)
          this.specsList = [...res1.list]
        }
        this.getCateList(res.list.first_cateid)
        this.specsChange(res.list.specsid)
        this.form.specsattr = [...res.list.specsattr.split(',')];
         this.editor.txt.html(this.form.description)
      }
    },
    //删除
    async deleFn(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http.post("/api/goodsdelete", { id });
        console.log(res);
        if (res.code == 200) {
          // 删除后退回第一页
          this.page = 1;
          this.getTableData();
        }
      } catch (error) {}
    },
    //提交
    async submitFn() {
      //获取富文本编辑框内容
      this.form.description = this.editor.txt.html();
      console.log(this.form);
      this.form.specsattr = this.form.specsattr.join(",");
      let url = this.info.isAdd ? "/api/goodsadd" : "/api/goodsedit";
      let res = await this.$http.upload(url, this.form);
      console.log(res);
      if (res.code == 200) {
        this.$message.success(res.msg);
        this.getTableData();
      } else {
        this.$message.error(res.msg);
      }
      this.info.isShow = false;
    },
    openFn() {
      this.getCateList();
      if (this.info.isAdd) {
        this.getSpecsList();
      }
    },
    openedFn() {
      //重置富文本编辑框
      document.querySelector("#editor").innerHTML = "";
      // 实例化 富文本编辑器实例
      this.editor = new E("#editor");
      // 创建dom 结构
      this.editor.create();
      // 防止数据在点击编辑时没有回来，创建时重新赋值
      this.editor.txt.html(this.form.description);
    },
    resetFn() {
      this.info.isAdd = true;
      this.$refs.file.clearFiles();
      this.info.dialogVisible = false;
      this.info.dialogImageUrl = "";
      this.form = {
        ...defaultForm
      };
      this.firstCateList = [];
      this.specsattr = [];
      this.specsList = [];
      this.specsAttrList = [];
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
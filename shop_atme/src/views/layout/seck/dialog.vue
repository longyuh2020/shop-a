<template>
  <el-dialog
    @open="openFn"
    @close="resetFn"
    :title="info.isAdd?'限时秒杀添加':'限时秒杀编辑'"
    :visible.sync="info.isShow"
  >
    <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
      <el-form-item label="轮播图标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="活动期限">
        <el-date-picker
          v-model="arrT"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
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
        <el-select v-model="form.second_cateid" @change="secondChange">
          <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
          -->
          <el-option
            v-for="(item,index) in secondCateList"
            :key="index"
            :label="item.catename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品">
        <el-select v-model="form.goodsid">
          <!-- 动态生成option
                label:选项文本
                value: v-model 关联的数据
          -->
          <el-option
            v-for="(item,index) in goodsList"
            :key="index"
            :label="item.goodsname"
            :value="item.id"
          ></el-option>
        </el-select>
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
  begintime: "",
  endtime: "",
  first_cateid: "", //商品一级分类编号
  second_cateid: "", //商品二级分类编号
  goodsid: "", //商品编号
  status: true
};
export default {
  data() {
    return {
      form: {
        ...dealutForm
      },
       // 一级分类
      firstCateList: [],
      secondCateList: [],
      goodsList:[],
      //时间
      arrT : [],
      fsId : 0,
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
      this.info.isAdd = true;
      this.form = {
        ...dealutForm
      };
      this.arrT = []
    },
    //提交
    submitFn() {
      this.$refs.ruleForm.validate(async value => {
        if (value) {
          // 利用 isAdd 判断 提交的接口地址
          let url = this.info.isAdd ? "/api/seckadd" : "/api/seckedit";
          this.form.status = this.form.status ? 1 : 2;
          this.form.begintime = this.arrT[0].getTime();
          this.form.endtime = this.arrT[1].getTime();
          console.log(this.form)
          let res = await this.$http.post(url, this.form);
          if (res.code == 200) {
            this.$emit("getTable");
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },
    //获取分类
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
    //  async getGoodsList(id) {
    //   let res = await this.$http.get("/api/goodsinfo", { id });
    //   console.log(res);

    // },
     async getSecondList(fid,sid) {
      let res = await this.$http.get("/api/goodslist",{fid,sid});
      console.log(res);
      if(res.code==200){
        this.goodsList = res.list;
      }
    },
    firstChange(id){
      this.getCateList(id)
      this.fsId = id;
    },
    secondChange(sid){
      this.getSecondList(this.fsId,sid)
    },
    openFn() {
      this.getCateList()
    }
  },
  props: ["info"]
};
</script>
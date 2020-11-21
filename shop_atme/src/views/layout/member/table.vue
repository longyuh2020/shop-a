<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
    >
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
      <el-table-column  label="注册日期" width="180">
         <template slot-scope="scope">
           {{scope.row.addtime|timed}}
        </template>
      </el-table-column>
  
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button @click="editFn(scope.row.uid)">编辑</el-button>
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
      :page-size="htr.size"
      :current-page.sync="htr.pag"
      layout="prev, pager, next"
      :total="total"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: ["tableData",'htr','total'],
  methods: {
    editFn(uid){
      this.$emit('edit',uid)
    },
    pageChange(cur){
      this.htr.page = cur;

    },
  },
  filters : {
    timed(now){
      var now1 = new Date(parseInt(now));
      var year=now1.getFullYear();  //取得4位数的年份
      var month=now1.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
      var date=now1.getDate();      //返回日期月份中的天数（1到31）
      var hour=now1.getHours();     //返回日期中的小时数（0到23）
      var minute=now1.getMinutes(); //返回日期中的分钟数（0到59）
      var second=now1.getSeconds(); //返回日期中的秒数（0到59）
      return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
      
    }
  },
};
</script>
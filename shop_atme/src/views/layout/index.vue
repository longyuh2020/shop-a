<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="10" :offset="2">
        <div class="data_col">
          <h3 class="tat">商品总览</h3>
          <el-col :span="6">
            <div>100</div>
            <div>已下架</div>
          </el-col>
          <el-col :span="6">
            <div>400</div>
            <div>已上架</div>
          </el-col>
          <el-col :span="6">
            <div>50</div>
            <div>库存紧张</div>
          </el-col>
          <el-col :span="6">
            <div>500</div>
            <div>全部商品</div>
          </el-col>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="data_col">
          <h3 class="tat">用户总览</h3>
          <el-col :span="6">
            <div>100</div>
            <div>今日新增</div>
          </el-col>
          <el-col :span="6">
            <div>200</div>
            <div>昨日新增</div>
          </el-col>
          <el-col :span="6">
            <div>1000</div>
            <div>本月新增</div>
          </el-col>
          <el-col :span="6">
            <div>5000</div>
            <div>会员总数</div>
          </el-col>
        </div>
      </el-col>
    </el-row>

    <div id="main" class="main2"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  //挂载完成
  mounted() {
    let myChart = echarts.init(document.getElementById("main"));
    let option = {
      title: {
        text: "ECharts 入门示例"
      },
      tooltip: {},
      legend: {
        data: ["近一周订单数量"]
      },
      xAxis: {
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        boundaryGap:false
      },
      yAxis: {
          max : 1000,
          min : 0
      },
      series: [
        {
          name: "近一周订单数量",
          type: "line",
          data: [520, 600, 430, 300, 400, 650, 810]
        }
      ],
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      }
    };
    myChart.setOption(option);
  }
};
</script>

<style lang="stylus">
.main {
  .data_col {
    height: 150px;
    border: 1px solid #000;
    margin-top: 20px;

    .tat {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      background: #fff;
      font-size: 18px;
      font-weight: normal;
    }

    .el-col {
      text-align: center;
      margin-top: 30px;

      div:nth-child(1) {
        color: red;
        margin-bottom: 4px;
      }
    }
  }

  .main2 {
    width: 740px;
    height: 400px;
    margin-left: 100px;
    margin-top 50px
  }
}
</style>
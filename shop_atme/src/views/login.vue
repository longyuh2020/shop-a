<template>
  <div class="login_bg">
    <div class="login_warp">
      <h3>登录</h3>
      <el-form label-width="0" :model="info" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input v-model="info.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="info.password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="loginFn">登录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>

import {mapActions} from 'vuex';
export default { 
  data() {
    return {
      info: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true, //必填
            message: "请输入账户名", //提示信息
            trigger: "blur" //触发条件
          },
          {
            max: 6,
            min: 4,
            message: "请输入4~6个字母",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            pattern: /^\d{4,6}$/,
            message: "请输入4~6个数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions(['login']),
    loginFn() {
      // validate:对表单数据进行验证的方法
      // 验证结束后执行回调函数 ，该函数的参数就是验证结构
      this.$refs.ruleForm.validate(value => {
        console.log(value);
        if (value) {
          this.login(this.info)
        }
      });
    }
  }
};
</script>
<style lang="stylus">
.login_bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);

  .login_warp {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 300px;
    height: 300px;

    h3 {
      margin: 20px auto;
      color: #fff;
      text-align: center;
    }

    button {
      width: 100%;
    }
  }
}
</style>
import Vue from 'vue';
import Vuex from 'vuex';
import http from "@/utils/http.js"
import router from '@/router'
import {Message} from 'element-ui'
Vue.use(Vuex)

let store = new Vuex.Store({
    state : {
        //保存用户信息
        userinfo : localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')) : {}
    },
    getters : {
        //用户名
        username(state){
            return state.userinfo.username;
        },
        //菜单
        menus(state){
            return state.userinfo.menus;
        }
    },
    mutations : {
        setinfo(state,info){
            state.userinfo = info
        },
        //登出
        logout(state){
            localStorage.clear();
            state.userinfo = {};
            router.replace('/login')
        }
    },
    actions : {
        login(context,fromdata){
            http.post("/api/userlogin", fromdata).then(res => {
                if (res.code == 200) {
                  //储存
                  localStorage.setItem("userinfo", JSON.stringify(res.list));
                  context.commit('setinfo',res.list)
                  router.replace("/");
                } else {
                  Message({
                    message: res.msg,
                    type: "error"
                  });
                }
              });
        }
    }
})

export default store
import axios from 'axios';
import store from '../store';
import qs from 'qs';
// 拦截器响应所有axios



//携带token
axios.interceptors.request.use(config=>{
    //返回用户使用数据
   // console.log(config);
    let token = localStorage.getItem('userinfo')? JSON.parse(localStorage.getItem('userinfo')).token : '';
    //添加头部
    config.headers['Authorization'] = token;
    return config;
},error => {
    return Promise.reject(error)
});



axios.interceptors.response.use(res=>{
    if(res.data.code==403){
        store.commit('logout')
    }
    //返回用户使用数据
    return res.data;
},error => {
    return Promise.reject(error)
});

/**
 * get :发送get 请求的方法
 * @url：请求路径
 * @params:参数
 * : 返回axios promise 对象
 */

 function get(url,params = {}){
     return new Promise((res,rej)=>{
         axios({
             method : 'get',
             url,
             params
         
     }).then(data=>{
         res(data)
     }).catch(err=>{
         rej(err)
     })
    })
 }

 function post(url,data = {}){
    //  console.log(qs.stringify(data))
     //qs处理
     return new Promise((res,rej)=>{
         axios({
             method : 'post',
             url,
             data : qs.stringify(data)
         
     }).then(data=>{
         res(data)
     }).catch(err=>{
         rej(err)
     })
    })
 }

 function upload(url,data={}){
     return new Promise((res,rej)=>{
         //1. 实例化FormData，文件上传的容器 (为了实现文件上传)
         let formdata = new FormData();
         //2. 将表单数据转移到 formdata实例中
         for(let key in data){
             // append：向formdata实例中添加数据
            // @key: 被添加数据名称 
            // @this.form[key]:被添加数据值
            formdata.append(key,data[key])
         }
         axios({
             method : 'post',
             url,
             data : formdata,
             headers : {
                "Content-Type": "multipart/form-data"
             }
         }).then(data=>{
             res(data)
         }).catch(err=>{
             rej(err)
         })
     })
 }

 export default{
     get,
     post,
     upload
 }
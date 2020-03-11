import axios from 'axios'
import { Message} from 'element-ui'
import {LocalStorage} from '@/utils/storage'
//将URL地址前面相同的一段封装
const $http = axios.create({
  //timeout: 5000
})

$http.interceptors.request.use(config => {
  if (LocalStorage.get('token')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers['Authorization'] = 'Bearer '+LocalStorage.get('token');
  }
  return config;
}, error => {
  return Promise.reject(error);
});
// 封装get
export const get = (url, params) => {
  params = params || {};
  return new Promise((resolve, reject) => {
    $http.get(url, {
      params,
    }).then(resp => {
      if(resp.status === 200 && resp.data !== undefined && resp.data !== null) {
        if (resp.data.code === 202) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您的登录已过期，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您的登录已过期，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else if (resp.data.code === 243) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您尚无此权限，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您尚无此权限，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else{
          resolve(resp.data)
        }

      }else {
        alert('网络繁忙')
      }
    }).catch(err => {
      reject(err)
    })
  })
}

//封装post
export const post = (url, params) => {
  params = params || {};
  return new Promise((resolve, reject) => {
    $http.post(url,
      params
    ).then(resp => {
      if(resp.status === 200 && resp.data !== undefined && resp.data !== null) {
        if (resp.data.code === 202) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您的登录已过期，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您的登录已过期，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else if (resp.data.code === 243) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您尚无此权限，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您尚无此权限，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else{
          resolve(resp.data)
        }
      }else {
        alert('网络繁忙')
      }
    }).catch(err => {
      reject(err)
    })
  })
}

//封装post
export const put = (url, params) => {
  params = params || {};
  return new Promise((resolve, reject) => {
    $http.put(url,
      params
    ).then(resp => {
      if(resp.status === 200 && resp.data !== undefined && resp.data !== null) {
        if (resp.data.code === 202) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您的登录已过期，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您的登录已过期，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else if (resp.data.code === 243) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您尚无此权限，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您尚无此权限，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else{
          resolve(resp.data)
        }
      }else {
        alert('网络繁忙')
      }
    }).catch(err => {
      reject(err)
    })
  })
}

//封装patch
export const patch = (url, params) => {
  params = params || {};
  return new Promise((resolve, reject) => {
    $http.patch(url,
      params
    ).then(resp => {
      if(resp.status === 200 && resp.data !== undefined && resp.data !== null) {
        if (resp.data.code === 202) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您的登录已过期，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您的登录已过期，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else if (resp.data.code === 243) {
          var clearTime = 3
          var time = setInterval(() => {
            clearTime--
            if (clearTime === 1) {
              clearInterval(time)
            }
            a.message = '您尚无此权限，'+clearTime+'秒后跳转至登录页面'
          }, 1000)

          var a = Message({
            message:'您尚无此权限，3秒后跳转至登录页面',
            type:'error',
            center:true,
            onClose:action=>{
              localStorage.clear();
              window.location.href=process.env.VUE_APP_PUSH_URL
            }
          })
        }else{
          resolve(resp.data)
        }
      }else {
        alert('网络繁忙')
      }
    }).catch(err => {
      reject(err)
    })
  })
}

import axios from 'axios'

//将URL地址前面相同的一段封装
const $http = axios.create({
  timeout: 5000
})
// 封装get
export const get = (url, params) => {
  params = params || {};
  return new Promise((resolve, reject) => {
    $http.get(url, {
      params,
    }).then(resp => {
      if(resp.status === 200 && resp.data !== undefined && resp.data !== null) {
        resolve(resp.data)
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
        resolve(resp.data)
      }else {
        alert('网络繁忙')
      }
    }).catch(err => {
      reject(err)
    })
  })
}


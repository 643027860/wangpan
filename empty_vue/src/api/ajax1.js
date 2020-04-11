import axios from 'axios'
import qs from 'qs'

export default function ajax (url, data={}, type='GET',form=false) {
  return new Promise(function (resolve, reject) {
    // 执行异步ajax请求
    let promise
    if (type === 'GET') {
      // 准备url query参数数据
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr +=data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + dataStr
      }
      promise = axios.get(url)
    } else {
      // 发送post请求
      if(!form)
        promise = axios.post(url,qs.stringify(data))
      else
        promise = axios.post(url,data,{
          headers:{
            'Content-Type':'multipart/form-data',
          }
        })
    }
    promise.then(function (response) {
      // 成功了调用resolve()
      console.log(response.data)
      resolve(response.data)
    }).catch(function (error) {
      //失败了调用reject()
      reject(error)
    })
  })
}

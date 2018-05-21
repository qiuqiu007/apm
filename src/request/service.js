import axios from 'axios'
import { MessageBox} from 'mint-ui';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code&&(res.code !== 1001)) {
      MessageBox({
        title: '提示',
        message: res.errorMsg,
        confirmButtonClass: 'green-confirm-btn'
      });
      return Promise.reject('error')
    }
    else {
      return response.data
    }
  },
  error => {
    MessageBox({
      title: '提示',
      message: '数据请求出错，请重试!',
      confirmButtonClass: 'green-confirm-btn'
    });
    return Promise.reject(error)
  }
);

export default service

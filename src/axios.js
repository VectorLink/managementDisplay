import axios from "axios"
import Element from 'element-ui'
import router from './router'
import store from './store'


axios.defaults.baseURL = "http://localhost:8080"

//前置拦截

axios.interceptors.request.use(request => {
    request.headers['authorization']=store.state.token
    return request;
})

//后置拦截
axios.interceptors.response.use(response => {
        const res = response.data;
        if (res.code === 0) {
            return response
        } else {
            Element.Message.error(res.msg)
            return Promise.reject(res.msg)
        }
    }, error => {
        if (error.response.data) {
            error.message = error.response.data.msg
        }
        if (error.response.status === 401) {
            store.commit("REMOVE_INFO")
            router.push("/login")
        }
        Element.Message.error(error.response.msg)
        return Promise.reject(res.msg)
    }
)
import axios from 'axios'
import store from '@/store/index'
import router from "@/router/index";
import {baseURL} from "@/api/BaseURL";

const request = axios.create({
    baseURL: baseURL(),
    timeout: 3000,
    withCredentials: true
});

request.interceptors.request.use(config => {
    if (store.state.token) config.headers.common['Authorization'] = store.state.token
    return config;
}, error => {
    return Promise.reject(error);
});

request.interceptors.response.use(res => {
    return res;
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                store.commit("delMenus");
                store.commit("delPerms");
                store.commit("delUser");
                store.commit("delToken");
                router.push({
                    path: "/"
                }).then(r => {

                });
        }
    }
    return Promise.reject(error);
});

export default request

import axios from "axios";

const instance = axios.create({
    baseURL: '/api',

    timeout: 5000,

    withCredentials: true, // 异步请求携带cookie
	headers: {
		// 设置后端需要的传参类型
		'Content-Type': 'application/json',
		'token': 'your token',
		'X-Requested-With': 'XMLHttpRequest',
	},
});

export var userName = "";
export var userId = 0;

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function post(url, data) {
    return instance.post(url, data);
}

export function get(url, params) {
    return instance.get(url, {
        params: params
    });
}

export function put(url, data) {
    return instance.put(url, data);
}

export function del(url, data) {
    return instance.delete(url, {
        data: data
    });
}

//封装一个针对百度智能云的post函数
export function baiduPost(url, data, contentType = 'application/x-www-form-urlencoded') {
    // 创建一个新的 axios 实例，以确保每次请求都可以单独设置请求头
    const instance = axios.create({
        baseURL: '/baidu',
        timeout: 15000,
        headers: {
            'Content-Type': contentType,
            'Accept': 'application/json',
        },
    });

    instance.interceptors.response.use(
        response => {
            return response.data;
        },
        error => {
            return Promise.reject(error);
        }
    );

    // 发起请求
    return instance.post(url, data);
}
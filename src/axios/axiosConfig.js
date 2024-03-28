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


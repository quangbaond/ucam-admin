import type { AxiosRequestConfig, Method } from 'axios';

import { message as $message } from 'antd';
import axios from 'axios';

import { getStoreItem, storageKey } from '@/const';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
// import { history } from '@/routes/history';

const axiosInstance = axios.create({
    timeout: 60000,
});

axiosInstance.interceptors.request.use(
    config => {
        const user = getStoreItem(storageKey.USER_INFO);

        if (user && user.accessToken) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }

        store.dispatch(
            setGlobalState({
                loading: true,
            }),
        );

        return config;
    },
    error => {
        store.dispatch(
            setGlobalState({
                loading: false,
            }),
        );
        Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    config => {
        store.dispatch(
            setGlobalState({
                loading: false,
            }),
        );

        if (config?.data?.message) {
            $message.success(config.data.message);
        }

        return {
            status: true,
            message: config?.data?.message || 'success',
            result: config.data,
        };

        return config.data;
    },
    error => {
        store.dispatch(
            setGlobalState({
                loading: false,
            }),
        );

        // if needs to navigate to login page when request exception
        // history.replace('/login');
        if (error?.response?.status === 401) {
            window.localStorage.removeItem(storageKey.USER_INFO);
            window.location.reload();
        }

        let errorMessage = 'Có lỗi xảy ra';

        if (error?.message?.includes('Network Error')) {
            errorMessage = '';
        } else {
            errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra';
        }

        return {
            status: false,
            message: errorMessage,
            result: null,
        };
    },
);

export type Response<T = any> = {
    status: boolean;
    message: string;
    result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
    method: Lowercase<Method>,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
): MyResponse<T> => {
    // const prefix = '/api'
    const prefix = '';

    url = prefix + url;

    if (method === 'post') {
        return axiosInstance.post(url, data, config);
    } else if (method === 'delete') {
        return axiosInstance.delete(url);
    } else if (method === 'put') {
        return axiosInstance.put(url, data, config);
    } else {
        return axiosInstance.get(url, {
            params: data,
            ...config,
        });
    }
};

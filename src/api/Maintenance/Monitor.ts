import request from "@/api/request";

export const getIndex = () => {
    return request({
        url: '/bee/index',
        method: 'get'
    });
};

export const getConnectionParams = () => {
    return request({
        url: '/bee/params',
        method: 'get'
    });
};

export const getKeys = () => {
    return request({
        url: '/bee/keys',
        method: 'get'
    });
};

export const getKey = (key: string, type: string) => {
    return request({
        url: '/bee/key',
        method: 'get',
        params: {
            key, type
        }
    });
};

export const deleteAll = () => {
    return request({
        url: '/bee/deleteAll',
        method: 'delete'
    });
};

export const deleteKey = (key: string) => {
    return request({
        url: '/bee/delete',
        method: 'delete',
        params: {
            key
        }
    });
};

export const updateString = (key: string, value: string) => {
    return request({
        url: '/bee/updateString',
        method: 'get',
        params: {
            key, value
        }
    });
};

export const updateSetAndList = (key: string, type: string, value: string) => {
    return request({
        url: '/bee/updateSetAndList',
        method: 'get',
        params: {
            key, type, value
        }
    });
};

export const updateHash = (key: string, value: Object) => {
    return request({
        url: '/bee/updateHash',
        method: 'post',
        params: {
            key
        },
        data: value
    });
};

import request from "@/api/request";

export const getTypes = () => {
    return request({
        url: '/attachment/getTypes',
        method: 'get'
    });
};

export const getPage = (cur: number, size: number, condition: {
    type: string
}) => {
    return request({
        url: '/attachment/getPage',
        method: 'post',
        params: {
            cur, size
        },
        data: condition
    });
};

export const downloadFile = (file: string) => {
    return request({
        url: '/attachment/download',
        method: 'get',
        params: {
            file
        },
        responseType: 'blob'
    });
};

export const deleteFile = (file: string) => {
    return request({
        url: '/attachment/delete',
        method: 'delete',
        params: {
            file
        }
    });
};

export const deleteBatch = (files: Array<string>) => {
    return request({
        url: '/attachment/deleteBatch',
        method: 'delete',
        data: files
    });
};

export const downloadBatch = (files: Array<string>) => {
    return request({
        url: '/attachment/downloadBatch',
        method: 'post',
        data: files,
        responseType: 'blob'
    });
};

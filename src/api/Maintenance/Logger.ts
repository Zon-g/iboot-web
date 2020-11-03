import request from "@/api/request";

export const getLoggerPage = (cur: number, size:
    number, condition: {
    username: string, operation: string,
    startTime: Date, end: Date
}) => {
    return request({
        url: '/log/getPage',
        method: 'post',
        params: {
            cur, size
        },
        data: condition
    });
};

export const getOperations = () => {
    return request({
        url: '/log/getOperations',
        method: 'get'
    });
};

export const clearAll = () => {
    return request({
        url: '/log/clearAll',
        method: 'delete'
    });
};

export const exportAsXls = (condition: {
    username: string, operation: string,
    startTime: Date, end: Date
}) => {
    return request({
        url: '/log/exportAsXLS',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });
};

export const exportAsXlsx = (condition: {
    username: string, operation: string,
    startTime: Date, end: Date
}) => {
    return request({
        url: '/log/exportAsXLSX',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });

};

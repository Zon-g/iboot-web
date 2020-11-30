import request from "@/api/request";

export const getPage = (cur: number, size: number, condition: {
    fromName: string, toName: string,
    startTime: Date, endTime: Date
}) => {
    return request({
        url: '/mail/getPage',
        method: 'post',
        params: {
            cur, size
        },
        data: condition
    });
};

export const addEmail = (email: {
    toName: string, to: Array<string>,
    subject: string, text: string
}, attachments: string) => {
    return request({
        url: '/mail/add',
        method: 'post',
        params: {
            attachments
        },
        data: email
    });
};

export const deleteEmail = (id: number) => {
    return request({
        url: '/mail/delete',
        method: 'delete',
        params: {
            id
        }
    });
};

export const downloadAsXls = (condition: {
    fromName: string, toName: string,
    startTime: Date, endTime: Date
}) => {
    return request({
        url: '/mail/exportAsXls',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });
};

export const downloadAsXlsx = (condition: {
    fromName: string, toName: string,
    startTime: Date, endTime: Date
}) => {
    return request({
        url: '/mail/exportAsXlsx',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });
};

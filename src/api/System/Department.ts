import request from "@/api/request";

export const getDepartments = () => {
    return request({
        url: '/department/list',
        method: 'get'
    });
};

export const getPage = (cur: number, size: number, department: {
    name: string, phone: string, address: string
}) => {
    return request({
        url: '/department/getPage',
        method: 'post',
        params: {
            cur, size
        },
        data: department
    });
};

export const exportDepartmentsAsXls = (condition: {
    name: string, phone: string, address: string
}) => {
    return request({
        url: '/department/exportAsXls',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });
};

export const exportDepartmentsAsXlsx = (condition: {
    name: string, phone: string, address: string
}) => {
    return request({
        url: '/department/exportAsXlsx',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });
};

export const deleteDepartment = (id: number) => {
    return request({
        url: '/department/delete',
        method: 'delete',
        params: {id}
    });
};

export const addDepartment = (department: {
    name: string, phone: string, address: string
}) => {
    return request({
        url: '/department/add',
        method: 'post',
        data: department
    });
};

export const updateDepartment = (department: {
    id: number, name: string, phone: string, address: string
}) => {
    return request({
        url: '/department/update',
        method: 'post',
        data: department
    })
};

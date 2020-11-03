import request from "@/api/request";

export const getPage = (cur: number, size: number, roleCondition: {
    name: string
}) => {
    return request({
        url: '/role/getPage',
        method: 'post',
        params: {
            cur, size
        },
        data: roleCondition
    });
};


export const exportRoleAsXls = (condition: { name: string }) => {
    return request({
        url: '/role/exportAsXls',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });
};

export const exportRoleAsXlsx = (condition: { name: string }) => {
    return request({
        url: '/role/exportAsXlsx',
        method: 'post',
        data: condition,
        responseType: 'blob'
    });
};

export const deleteRole = (id: number) => {
    return request({
        url: '/role/delete',
        method: 'delete',
        params: {id}
    });
};

export const addRole = (role: {
    name: string, remark: string
}) => {
    return request({
        url: '/role/add',
        method: 'post',
        data: role
    });
};

export const updateRole = (role: {
    id: number, name: string, remark: string
}) => {
    return request({
        url: '/role/update',
        method: 'post',
        data: role
    });
};

export const configRoleMenuById = (id: number, menus: Array<number>) => {
    return request({
        url: '/role/updateMenusByRoleId',
        method: 'post',
        params: {
            id
        },
        data: menus
    });
};

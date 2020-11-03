import request from "@/api/request";

export const getMenuTree = () => {
    return request({
        url: '/menu/getMenuTree',
        method: 'get'
    });
};

export const getMenus = (user: {
    id: number, username: string, admin: boolean
}) => {
    return request({
        url: '/menu/getMenus',
        method: 'post',
        data: user
    });
};

export const exportAsXls = () => {
    return request({
        url: '/menu/exportAsXls',
        method: 'get',
        responseType: 'blob'
    });
};

export const exportAsXlsx = () => {
    return request({
        url: '/menu/exportAsXlsx',
        method: 'get',
        responseType: 'blob'
    });
};

export const deleteMenu = (id: number) => {
    return request({
        url: '/menu/delete',
        method: 'delete',
        params: {
            id
        }
    });
};

export const addMenu = (role: {
    parentId: number, menuName: string, url: string,
    perms: string, icon: string, type: string, orderNum: number
}) => {
    return request({
        url: '/menu/add',
        method: 'post',
        data: role
    });
};

export const updateMenu = (role: {
    id: number, parentId: number, menuName: string, url: string,
    perms: string, icon: string, type: string, orderNum: number
}) => {
    return request({
        url: '/menu/update',
        method: 'post',
        data: role
    });
};

export const getMenusByRoleId = (id: number) => {
    return request({
        url: '/menu/getMenusByRoleId',
        method: 'get',
        params: {
            id
        }
    });
};

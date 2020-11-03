import request from '@/api/request'

export const getPage = (cur: number, size: number, UserCondition: {
    gender: string, nickname: string,
    department: string, email: string, username: string
}) => {
    return request({
        url: '/user/getPage',
        method: 'post',
        params: {
            cur,
            size
        },
        data: UserCondition
    });
};

export const exportUsersAsXls = (userCondition: {
    gender: string, nickname: string,
    department: string, email: string, username: string
}) => {
    return request({
        url: '/user/exportAsXLS',
        method: 'post',
        data: userCondition,
        responseType: 'blob'
    });
};

export const exportUsersAsXlsx = (userCondition: {
    gender: string, nickname: string,
    department: string, email: string, username: string
}) => {
    return request({
        url: '/user/exportAsXLSX',
        method: 'post',
        data: userCondition,
        responseType: 'blob'
    });
};

export const addUser = (user: {
    password: string, gender: string, phone: string, nickname: string,
    deptId: string, birth: string, email: string, username: string
}) => {
    return request({
        url: '/user/add',
        method: 'post',
        data: user
    });
};

export const getUserById = (id: number) => {
    return request({
        url: '/user/getBy',
        method: 'get',
        params: {id}
    });
};

export const updateUser = (user: {
    id: number, username: string, password: string, nickname: string,
    deptId: string, email: string, phone: string, gender: string, birth: string
}) => {
    return request({
        url: "/user/update",
        method: 'post',
        data: user
    });
};

export const deleteUser = (id: number) => {
    return request({
        url: '/user/delete',
        method: 'delete',
        params: {id}
    });
};

export const getUserRole = (id: number) => {
    return request({
        url: '/user/getUserRoleList',
        method: 'get',
        params: {
            id
        }
    });
};

export const configUserRole = (id: number, roles: Array<number>) => {
    return request({
        url: '/user/configUserRole',
        method: 'post',
        params: {
            id
        },
        data: roles
    });
};

export const resetPwd = (user: {
    id: number, password: string
}) => {
    return request({
        url: '/user/resetPwd',
        method: 'post',
        data: user
    });
};

export const updateUserInfo = (user: {
    id: number, username: string, nickname: string, email: string,
    avatar: string, phone: string, gender: string, birth: string
}) => {
    return request({
        url: '/user/updateUserInfo',
        method: 'post',
        data: user
    });
};

export const verifyPwd = (id: number, password: string) => {
    return request({
        url: '/user/verifyPwd',
        method: 'get',
        params: {
            id, password
        }
    });
};

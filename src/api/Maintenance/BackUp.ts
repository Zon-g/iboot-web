import request from "@/api/request";

export const getTables = () => {
    return request({
        url: '/backup/getTables',
        method: 'get'
    });
};

export const backupAll = () => {
    return request({
        url: '/backup/backupAll',
        method: 'get'
    });
};

export const backupTables = (tables: Array<string>) => {
    return request({
        url: '/backup/backupTables',
        method: 'post',
        data: tables
    });
};

export const getBackupFiles = () => {
    return request({
        url: '/backup/getBackupFiles',
        method: 'get'
    });
};

export const deleteBackupFile = (filename: string) => {
    return request({
        url: '/backup/deleteBackupFile',
        method: 'get',
        params: {
            filename
        }
    });
};

export const download = (filename: string) => {
    return request({
        url: '/backup/download',
        method: 'get',
        params: {
            filename
        }
    });
};

export const rollback = (filename: string) => {
    return request({
        url: '/backup/rollback',
        method: 'get',
        params: {
            filename
        }
    });
};

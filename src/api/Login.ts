import request from "@/api/request";

export const login = (loginRequest: {
    username: string, password: string, rememberMe: boolean
}) => {
    return request({
        url: '/auth/login',
        method: 'post',
        data: loginRequest
    });
};

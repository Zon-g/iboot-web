import request from "@/api/request";

export const listJobs = (jobName: string, cur: number, size: number) => {
    return request({
        url: '/job/list',
        method: 'get',
        params: {
            jobName, cur, size
        }
    });
};

export const saveJob = (job: {
    jobName: string, jobGroup: string, description: string,
    jobClassName: string, cronExpression: string
}) => {
    return request({
        url: '/job/add',
        method: 'post',
        data: job
    });
};

export const execute = (jobName: string, jobGroup: string) => {
    return request({
        url: '/job/trigger',
        method: 'get',
        params: {
            jobName, jobGroup
        }
    });
};

export const pause = (jobName: string, jobGroup: string) => {
    return request({
        url: '/job/pause',
        method: 'get',
        params: {
            jobName, jobGroup
        }
    });
};

export const resume = (jobName: string, jobGroup: string) => {
    return request({
        url: '/job/resume',
        method: 'get',
        params: {
            jobName, jobGroup
        }
    });
};

export const remove = (jobName: string, jobGroup: string) => {
    return request({
        url: '/job/remove',
        method: 'delete',
        params: {
            jobName, jobGroup
        }
    });
};

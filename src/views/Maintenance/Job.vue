<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运维管理</el-breadcrumb-item>
            <el-breadcrumb-item>定时任务</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline" :model="form">
                <el-form-item label="任务名称" size="small">
                    <el-input clearable v-model="form.jobName" placeholder="请输入任务名称"/>
                </el-form-item>

                <el-form-item size="small" style="width: 3000px;">
                    <el-button icon="el-icon-search" type="primary"
                               @click="getJobList">
                        查询任务
                    </el-button>
                    <el-button icon="el-icon-plus" type="success"
                               @click="addJobs" v-has-permission="'job:add'">
                        添加任务
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table border :data="jobs" v-loading="loading" style="width: 100%;" height="561"
                      :row-style="{height: '35px'}" :cell-style="{padding: '0px'}"
                      :header-row-style="{height: '35px'}" :header-cell-style="{padding:  '0px'}">
                <el-table-column type="index" width="50" fixed/>
                <el-table-column prop="jobName" label="任务名称" width="150" fixed/>
                <el-table-column prop="jobGroup" label="任务分组" width="150" fixed/>
                <el-table-column prop="description" label="任务描述" width="400"/>
                <el-table-column prop="jobClassName" label="执行类" width="400"/>
                <el-table-column prop="triggerState" label="任务状态" width="100"/>
                <el-table-column prop="cronExpression" label="任务时间" width="200"/>
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-edit"
                                   @click="modify(scope.row)"
                                   v-has-permission="'job:update'"/>
                        <el-button type="success" size="mini" icon="el-icon-caret-right"
                                   @click="execute(scope.row.jobName, scope.row.jobGroup)"
                                   v-has-permission="'job:exe'"/>
                        <el-button type="warning" size="mini" icon="el-icon-circle-close"
                                   @click="pause(scope.row.jobName, scope.row.jobGroup)"
                                   v-has-permission="'job:pause'"/>
                        <el-button type="primary" size="mini" icon="el-icon-refresh-right"
                                   @click="resume(scope.row.jobName, scope.row.jobGroup)"
                                   v-has-permission="'job:resume'"/>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                                   @click="remove(scope.row.jobName, scope.row.jobGroup)"
                                   v-has-permission="'job:remove'"/>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="cur" :page-sizes="[15, 30]" :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"/>

            <el-dialog :title="this.job.jobName === '' ? '添加任务' : '修改任务'" :visible.sync="showForm">
                <el-form :model="job" :rules="jobRules" ref="job" label-width="150px" class="demo-ruleForm">
                    <el-form-item label="任务名称" prop="jobName" size="small">
                        <el-input v-model="job.jobName"/>
                    </el-form-item>
                    <el-form-item label="任务分组" prop="jobGroup" size="small">
                        <el-input v-model="job.jobGroup"/>
                    </el-form-item>
                    <el-form-item label="任务描述" prop="description" size="small">
                        <el-input v-model="job.description"/>
                    </el-form-item>
                    <el-form-item label="执行类" prop="jobClassName" size="small">
                        <el-select v-model="job.jobClassName" placeholder="请选择">
                            <el-option v-for="job in scheduledJobs"
                                       :key="job.jobClass"
                                       :label="job.jobName"
                                       :value="job.jobClass"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Cron执行时间" prop="cronExpression" size="small">
                        <el-input v-model="job.cronExpression"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel" size="small">取消</el-button>
                    <el-button @click="submit('job')" size="small" type="primary">确定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {
    listJobs, saveJob, execute,
    pause, resume, remove, listScheduledJobs
} from "@/api/Maintenance/Job";

export default {
    name: "Job",
    data() {
        return {
            scheduledJobs: [],
            job: {
                jobName: '',
                jobGroup: '',
                description: '',
                jobClassName: '',
                cronExpression: ''
            },
            jobRules: {
                jobName: [
                    {required: true, message: '请输入任务名称', trigger: 'blur'}
                ],
                jobGroup: [
                    {required: true, message: '请输入任务分组', trigger: 'blur'}
                ],
                description: [
                    {required: true, message: '请输入任务描述', trigger: 'blur'}
                ],
                jobClassName: [
                    {required: true, message: '请输入任务执行类全限定名', trigger: 'blur'}
                ],
                cronExpression: [
                    {required: true, message: '请输入cron表达式', trigger: 'blur'}
                ]
            },
            showForm: false,
            form: {
                jobName: ''
            },
            jobs: [],
            loading: false,
            cur: 1,
            total: 0,
            size: 15
        }
    },
    created() {
        this.getJobList();
    },
    methods: {
        addJobs() {
            this.showForm = true;
            listScheduledJobs().then(res => {
                if (res.data.code === 200) {
                    this.scheduledJobs = res.data.data.jobs;
                }
            }).catch(error => console.log(error));
        },
        async remove(jobName, jobGroup) {
            await remove(jobName, jobGroup).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '移除定时任务成功',
                        type: 'success'
                    })
                }
            }).catch(error => console.log(error));
            this.getJobList();
        },
        async resume(jobName, jobGroup) {
            await resume(jobName, jobGroup).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '定时任务继续执行',
                        type: 'success'
                    })
                }
            }).catch(error => console.log(error));
            this.getJobList();
        },
        async pause(jobName, jobGroup) {
            await pause(jobName, jobGroup).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '暂停定时任务成功',
                        type: 'success'
                    })
                }
            }).catch(error => console.log(error));
            this.getJobList();
        },
        modify(row) {
            this.showForm = true;
            this.job.jobName = row.jobName;
            this.job.jobGroup = row.jobGroup;
            this.job.description = row.description;
            this.job.jobClassName = row.jobClassName;
            this.job.cronExpression = row.cronExpression;
            this.job.oldJobName = row.jobName;
            this.job.oldJobGroup = row.jobGroup;
        },
        async execute(jobName, jobGroup) {
            await execute(jobName, jobGroup).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '启动定时任务成功',
                        type: 'success'
                    })
                }
            }).catch(error => console.log(error));
            this.getJobList();
        },
        submit(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.doSubmit();
                } else {
                    this.$message.info('参数校验未通过, 请重新输入');
                }
            });
        },
        async doSubmit() {
            await saveJob(this.job).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '添加定时任务成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            this.getJobList();
            this.cancel();
        },
        cancel() {
            this.job = {
                jobName: '',
                jobGroup: '',
                description: '',
                jobClassName: '',
                cronExpression: ''
            }
            this.showForm = false
        },
        handleCurrentChange(val) {
            this.cur = val;
            this.getJobList();
        },
        handleSizeChange(val) {
            this.size = val;
            this.getJobList();
        },
        getJobList() {
            listJobs(this.form.jobName, this.cur, this.size).then(res => {
                if (res.data.code === 200) {
                    this.jobs = res.data.data.list;
                    this.total = res.data.data.total;
                }
            }).catch(error => console.log(error));
        }
    }
}
</script>

<style scoped>

</style>

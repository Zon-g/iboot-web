<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>基本功能</el-breadcrumb-item>
            <el-breadcrumb-item>邮件管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">

            <el-form :inline="true" :model="form" class="demo-form-inline">

                <el-form-item label="发件人" size="small">
                    <el-input clearable v-model="form.from" placeholder="请输入发件人姓名"/>
                </el-form-item>

                <el-form-item label="收件人" size="small">
                    <el-input clearable v-model="form.to" placeholder="请输入收件人姓名"/>
                </el-form-item>

                <el-form-item label="时间范围" size="small">
                    <el-date-picker type="daterange" align="right" unlink-panels range-separator="至"
                                    v-model="form.dateRange" start-placeholder="开始日期"
                                    end-placeholder="结束日期" :picker-options="pickerOptions"/>
                </el-form-item>

                <el-form-item style="width: 3000px;" size="small">
                    <el-button icon="el-icon-refresh" @click="resetCondition">
                        重置条件
                    </el-button>
                    <el-button icon="el-icon-search" type="primary" @click="getPage">
                        查询记录
                    </el-button>
                    <el-button icon="el-icon-plus" type="success" @click="showForm = true">
                        发送邮件
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" @click="downloadAsXls">
                        Xls文件
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" @click="downloadAsXlsx">
                        Xlsx文件
                    </el-button>
                </el-form-item>

            </el-form>

            <el-table :data="mails" border v-loading="loading" style="width: 100%;" height="575"
                      :row-style="{height: '35px'}" :cell-style="{padding: '0px'}"
                      :header-row-style="{height: '35px'}" :header-cell-style="{padding: '0px'}">
                <el-table-column prop="id" label="记录id" width="255" fixed/>
                <el-table-column prop="fromName" label="发件人姓名" width="150"/>
                <el-table-column prop="from" label="发件人邮箱" width="255"/>
                <el-table-column prop="toName" label="收件人姓名" width="150"/>
                <el-table-column prop="to" label="收件人邮箱" width="255"/>
                <el-table-column prop="subject" label="邮件主题" width="255"/>
                <el-table-column prop="scheduled" label="定时任务" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.scheduled === 0 ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="scheduleTime" label="定时任务时间" width="200"/>
                <el-table-column prop="createTime" label="记录创建时间" width="200"/>
                <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-view" type="primary" size="mini"
                                   @click="viewRecord(scope.row)"/>
                        <el-button icon="el-icon-delete" type="danger" size="mini"
                                   @click="deleteMail(scope.row.id)"/>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="current" :page-sizes="[15, 30]" :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"/>

            <el-dialog :title="'添加邮件信息'" :visible.sync="showForm" :width="'75%'">
                <el-form :model="email" :rules="emailRules" ref="email" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="收件人姓名" size="small">
                        <el-input clearable v-model="email.toName"/>
                    </el-form-item>
                    <el-form-item label="收件人邮箱" prop="to" size="small">
                        <el-input clearable v-model="email.to">
                            <template slot="append">
                                <span @click="choose">
                                    点击选择
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="邮件主题" prop="subject" size="small">
                        <el-input clearable v-model="email.subject"/>
                    </el-form-item>
                    <el-form-item label="邮件内容" size="small">
                        <mavon-editor v-model="email.content" ref="md"
                                      @change="changeContent" @imgAdd="AddImage"
                                      style="min-height: 350px"/>
                    </el-form-item>
                    <el-form-item label="附件" size="small">
                        <el-input clearable v-model="attachments">
                            <template slot="append">
                                <span @click="uploadAttachment">
                                    添加附件
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="定时发送" size="small">
                        <el-row>
                            <el-col :span="2">
                                <el-switch v-model="email.scheduled === 1"
                                           active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           @change="changeEmailScheduledStatus"/>
                            </el-col>
                            <el-col :span="22">
                                <el-date-picker v-if="email.scheduled === 1"
                                                v-model="email.scheduleTime"
                                                type="datetime"
                                                placeholder="选择日期时间"
                                                align="right"
                                                :picker-options="pickerOptions2"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="cancelEmail">取消</el-button>
                    <el-button size="small" type="primary" @click="submitEmail('email')">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog :title="'邮件预览'" :visible.sync="viewEmail">
                <div v-html="viewInnerHtml"></div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="closeView">关闭</el-button>
                </div>
            </el-dialog>

            <el-dialog :title="'选择用户'" :visible.sync="chooseUsers">
                <el-transfer :data="users" v-model="selected" :titles="['用户列表', '已选用户']"
                             @change="handleChange"/>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="addMailList">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog :title="'上传附件'" :visible.sync="uploadAttach" width="30%">
                <span>
                    <el-upload class="upload-demo" ref="upload" drag action="" multiple
                               :auto-upload="false" :on-remove="handleFileRemove">
                        <i class="el-icon-upload"/>
                        <div class="el-upload__text">点击上传</div>
                    </el-upload>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelUploadAttach">取消</el-button>
                    <el-button @click="handleUploadAttach" type="primary">确定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import {
    getPage, addEmail, deleteEmail,
    downloadAsXls, downloadAsXlsx
} from "@/api/Basic/Mail";
import {
    userMailList
} from "@/api/System/User";
import axios from 'axios'

export default {
    name: "Mail",
    data: function () {
        return {
            uploadAttach: false,
            attachments: '',
            selected: [],
            users: [],
            chooseUsers: false,
            viewInnerHtml: '',
            viewEmail: false,
            email: {
                toName: '',
                to: [],
                subject: '',
                content: '',
                html: '',
                scheduled: 0,
                scheduleTime: ''
            },
            emailRules: {
                to: [
                    {required: true, message: '请输入收件人邮箱', trigger: 'blur'}
                ],
                subject: [
                    {required: true, message: '请输入邮件主题', trigger: 'blur'}
                ]
            },
            showForm: false,
            current: 1,
            size: 15,
            total: 0,
            loading: false,
            mails: [],
            form: {
                from: '',
                to: '',
                dateRange: []
            },
            pickerOptions2: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            }
        };
    },
    created() {
        this.getPage();
    },
    methods: {
        changeEmailScheduledStatus() {
            this.email.scheduled ^= 1;
        },
        handleFileRemove() {
            this.$message({
                message: '已删除所选文件',
                type: 'info'
            });
        },
        handleUploadAttach() {
            let params = new FormData();
            for (let i = 0; i < this.$refs.upload.uploadFiles.length; i++) {
                params.append('files', this.$refs.upload.uploadFiles[i].raw);
            }
            axios.post('http://localhost:8080/api/mail/attachmentUpload', params, {
                headers: {
                    'Content-Type': 'multipart/form-data; charset=utf-8',
                    'Authorization': this.$store.state.token
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message.success('上传附件成功');
                    let paths = res.data.data.paths;
                    for (let i = 0; i < paths.length; i++) {
                        this.attachments += paths[i];
                        if (i !== paths.length - 1) this.attachments += ',';
                    }
                    this.uploadAttach = false;
                    this.$refs.upload.uploadFiles.length = 0;
                }
            }).catch(error => console.log(error));
        },
        cancelUploadAttach() {
            this.uploadAttach = false;
        },
        uploadAttachment() {
            this.uploadAttach = true;
        },
        handleChange(curVal, direction, key) {
            this.selected = [];
            for (let i = 0; i < curVal.length; i++) {
                this.selected.push(curVal[i]);
            }
        },
        addMailList() {
            this.email.to = '';
            this.email.toName = '';
            for (let i = 0; i < this.selected.length; i++) {
                this.email.to += this.selected[i].email;
                this.email.toName += this.selected[i].nickname;
                if (i !== this.selected.length - 1) {
                    this.email.to += ',';
                    this.email.toName += ',';
                }
            }
            this.chooseUsers = false;
        },
        choose() {
            this.users = [];
            userMailList().then(res => {
                if (res.data.code === 200) {
                    let arr = res.data.data.list;
                    for (let i = 0; i < arr.length; i++) {
                        this.users.push({
                            key: arr[i],
                            label: arr[i].deptName + " => " + arr[i].nickname
                        })
                    }
                    this.chooseUsers = true;
                }
            }).catch(error => console.log(error));
        },
        closeView() {
            this.viewEmail = false;
            this.viewInnerHtml = '';
        },
        viewRecord(obj) {
            this.viewEmail = true;
            this.viewInnerHtml = obj.text;
        },
        async deleteMail(id) {
            await deleteEmail(id).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除邮件信息成功',
                        type: 'success'
                    })
                }
            }).catch(error => console.log(error));
            await this.getPage();
        },
        downloadAsXls() {
            let con = {
                fromName: this.form.from,
                toName: this.form.to,
                startTime: this.form.dateRange[0],
                endTime: this.form.dateRange[1]
            };
            downloadAsXls(con).then(res => {
                const blob = new Blob([res.data]);
                const fileName = this.$moment(new Date()).format("YYYYMMDDHHmmss") + '.xls';
                const link = document.createElement('a');
                link.download = fileName;
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            }).catch(error => console.log(error));
        },
        downloadAsXlsx() {
            let con = {
                fromName: this.form.from,
                toName: this.form.to,
                startTime: this.form.dateRange[0],
                endTime: this.form.dateRange[1]
            };
            downloadAsXlsx(con).then(res => {
                const blob = new Blob([res.data]);
                const fileName = this.$moment(new Date()).format("YYYYMMDDHHmmss") + '.xlsx';
                const link = document.createElement('a');
                link.download = fileName;
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            }).catch(error => console.log(error));
        },
        cancelEmail() {
            this.email = {
                toName: '',
                to: [],
                subject: '',
                content: '',
                html: '',
                scheduled: 0,
                scheduleTime: ''
            }
            this.showForm = false
            this.selected = []
        },
        submitEmail(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.doSubmitEmail();
                } else {
                    this.$message({
                        message: '参数校验未通过, 请重新输入',
                        type: 'info'
                    });
                }
            });
        },
        async doSubmitEmail() {
            let entity = {
                toName: this.email.toName,
                to: this.email.to,
                subject: this.email.subject,
                text: this.email.html,
                scheduled: this.email.scheduled,
                scheduleTime: this.email.scheduleTime
            }
            if (entity.scheduled === 1) {
                let time = entity.scheduleTime;
                let len = time.length;
                entity.scheduleTime = time.substring(len - 2, len) + ' ';
                entity.scheduleTime += time.substring(len - 5, len - 3) + ' ';
                entity.scheduleTime += time.substring(len - 8, len - 6) + ' ';
                entity.scheduleTime += time.substring(len - 11, len - 9) + ' ';
                entity.scheduleTime += time.substring(len - 14, len - 12) + ' ? ';
                entity.scheduleTime += time.substring(len - 19, len - 15);
            }
            await addEmail(entity, this.attachments).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '发送邮件成功',
                        type: 'success'
                    })
                }
            }).catch(error => console.log(error));
            this.cancelEmail();
            await this.getPage();
        },
        resetCondition() {
            this.form = {
                from: '',
                to: '',
                dataRange: []
            };
            this.current = 1;
        },
        handleCurrentChange(val) {
            this.current = val;
            this.getPage();
        },
        handleSizeChange(val) {
            this.size = val;
            this.getPage();
        },
        getPage() {
            this.loading = true;
            let con = {
                fromName: this.form.from,
                toName: this.form.to,
                startTime: this.form.dateRange[0],
                endTime: this.form.dateRange[1]
            };
            getPage(this.current, this.size, con).then(res => {
                if (res.data.code === 200) {
                    this.total = res.data.data.total;
                    this.mails = res.data.data.list;
                    this.loading = false;
                }
            }).catch(error => console.log(error));
        },
        AddImage(pos, $file) {
            let formData = new FormData();
            formData.append('file', $file);
            axios.post('http://localhost:8080/api/mail/imageUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data; charset=utf-8',
                    'Authorization': this.$store.state.token
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message.success("上传图片成功");
                    let path = res.data.data.path;
                    let len = path.split('\\').length;
                    let newPath = 'http://localhost:8080/api/mail/' + path.split('\\')[len - 1];
                    this.$refs.md.$img2Url(pos, newPath);
                }
            }).catch(error => console.log(error));
        },
        changeContent(value, render) {
            this.email.html = render;
        }
    }
}
</script>

<style scoped>

</style>

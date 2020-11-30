<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-form :inline="true" :model="form" class="demo-form-inline">

                <el-form-item label="用户名" size="small">
                    <el-input clearable v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="昵称" size="small">
                    <el-input clearable v-model="form.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>

                <el-form-item label="部门" size="small">
                    <el-select v-model="form.department" placeholder="请选择">
                        <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px"
                                  class="el-tag el-tag--success el-tag--mini el-tag--plain">{{ item.total }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="邮箱" size="small">
                    <el-input clearable v-model="form.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>

                <el-form-item size="small">
                    <el-radio v-model="form.gender" label="1">
                        <span class="el-tag el-tag--success el-tag--mini el-tag--plain">男</span>
                    </el-radio>
                    <el-radio v-model="form.gender" label="0">
                        <span class="el-tag el-tag--success el-tag--mini el-tag--plain">女</span>
                    </el-radio>
                    <el-radio v-model="form.gender" label="-1">
                        <span class="el-tag el-tag--success el-tag--mini el-tag--plain">保密</span>
                    </el-radio>
                </el-form-item>

                <el-form-item size="small" style="width: 3000px;">
                    <el-button icon="el-icon-refresh" @click="reset">
                        重置条件
                    </el-button>
                    <el-button type="primary" icon="el-icon-search" @click="findUserList">
                        查询用户
                    </el-button>
                    <el-button type="success" icon="el-icon-plus" @click="showForm = true"
                               v-has-permission="'user:add'">
                        添加用户
                    </el-button>
                    <el-button type="warning" icon="el-icon-download" @click="exportAsXls"
                               v-has-permission="'user:download'">
                        xls文件
                    </el-button>
                    <el-button type="warning" icon="el-icon-download" @click="exportAsXlsx"
                               v-has-permission="'user:download'">
                        xlsx文件
                    </el-button>
                </el-form-item>

                <el-table :data="userList" border v-loading="loading" style="width: 100%" height="561"
                          :row-style="{height: '35px'}" :cell-style="{padding: '0px'}"
                          :header-row-style="{height: '35px'}" :header-cell-style="{padding:  '0px'}">
                    <el-table-column type="index" width="50" fixed/>
                    <el-table-column prop="id" label="用户id" width="70" fixed></el-table-column>
                    <el-table-column prop="username" label="用户名" width="150" fixed></el-table-column>
                    <el-table-column prop="nickname" label="昵称" width="150"></el-table-column>
                    <el-table-column prop="department" label="所属部门" width="180"></el-table-column>
                    <el-table-column prop="email" label="邮箱" width="210"></el-table-column>
                    <el-table-column prop="phone" label="电话" width="150"></el-table-column>
                    <el-table-column prop="sex" label="性别" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.gender === 1 ? '男' : (scope.row.gender === 0 ? '女' : '保密') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="birth" label="生日" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="240"></el-table-column>
                    <el-table-column prop="modifyTime" label="修改时间" width="240"></el-table-column>
                    <el-table-column prop="status" label="是否禁用" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.status === 0 ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="230">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-edit"
                                       @click="updateUserById(scope.row.id)"
                                       v-has-permission="'user:update'"/>
                            <el-button type="success" size="mini" icon="el-icon-lock"
                                       @click="resetUserPassword(scope.row.id)"
                                       v-has-permission="'user:update'"/>
                            <el-button type="danger" size="mini" icon="el-icon-delete"
                                       @click="deleteById(scope.row.id)"
                                       v-has-permission="'user:delete'"/>
                            <el-button type="warning" size="mini" icon="el-icon-s-tools"
                                       @click="configUserRoleById(scope.row.id)"
                                       v-has-permission="'user:config'"/>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination style="padding-top: 20px;" @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="current" :page-sizes="[15, 30]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </el-form>

            <el-dialog :title="this.user.id != null ? '修改用户信息' : '添加用户信息'" :visible.sync="showForm">
                <el-form :model="user" :rules="userRules" ref="user" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username" size="small">
                        <el-input v-model="user.username"/>
                    </el-form-item>
                    <el-form-item label="密   码" prop="password" v-if="this.user.id == null" size="small">
                        <el-input v-model="user.password" type="text"/>
                    </el-form-item>
                    <el-form-item label="昵   称" prop="nickname" size="small">
                        <el-input v-model="user.nickname"/>
                    </el-form-item>
                    <el-form-item label="所属部门" prop="department" size="small">
                        <el-select v-model="user.deptId" placeholder="请选择部门">
                            <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px"
                                      class="el-tag el-tag--success el-tag--mini el-tag--plain">{{ item.total }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="邮   箱" prop="email" size="small">
                        <el-input v-model="user.email"/>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone" size="small">
                        <el-input v-model="user.phone"/>
                    </el-form-item>
                    <el-form-item label="性   别" prop="gender" size="small">
                        <el-radio v-model="user.gender" label="1">
                            <span class="el-tag el-tag--success el-tag--mini el-tag--plain">男</span>
                        </el-radio>
                        <el-radio v-model="user.gender" label="0">
                            <span class="el-tag el-tag--success el-tag--mini el-tag--plain">女</span>
                        </el-radio>
                        <el-radio v-model="user.gender" label="-1">
                            <span class="el-tag el-tag--success el-tag--mini el-tag--plain">保密</span>
                        </el-radio>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="birth" size="small">
                        <el-date-picker type="date" placeholder="请选择日期" v-model="user.birth" style="width: 100%;"/>
                    </el-form-item>
                    <el-form-item label="用户状态" prop="status" size="small">
                        <el-switch v-model="user.status === 1" active-color="#13ce66" inactive-color="#ff4949"
                                   @change="changeUserStatus"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel" size="small">取消</el-button>
                    <el-button type="primary" @click="submit('user')" size="small">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog :visible.sync="configUser" title="配置用户角色">
                <el-transfer v-model="selected" :data="roleList" :titles="['角色列表','已选角色']" @change="handleChange"/>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelConfig" size="small">取消</el-button>
                    <el-button type="primary" @click="submitConfig" size="small">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog :visible.sync="resetPwd" title="设置用户密码">
                <el-form :model="resetPwdForm" ref="resetPwd" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户id" size="small">
                        <el-input :readonly="true" v-model="resetPwdForm.id"/>
                    </el-form-item>
                    <el-form-item label="新密码" size="small">
                        <el-input v-model="resetPwdForm.password"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelResetPwd" size="small">取消</el-button>
                    <el-button type="primary" @click="submitResetPwd" size="small">确定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {
    getPage, exportUsersAsXls, exportUsersAsXlsx,
    addUser, getUserById, updateUser, deleteUser,
    getUserRole, configUserRole, resetPwd
} from '@/api/System/User'
import {getDepartments} from "@/api/System/Department"

export default {
    name: "User",
    data() {
        return {
            resetPwdForm: {
                id: -1,
                password: ""
            },
            resetPwd: false,
            curUserId: -1,
            configUser: false,
            selected: [],
            roleList: [],
            loading: true,
            user: {
                username: '',
                password: '',
                nickname: '',
                deptId: '',
                email: '',
                phone: '',
                gender: '-1',
                birth: '',
                status: 1
            },
            userRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                nickname: [
                    {required: true, message: '请输入昵称', trigger: 'blur'}
                ],
                deptId: [
                    {required: true, message: '请选择部门', trigger: 'change'}
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入联系电话', trigger: 'blur'}
                ],
                birth: [
                    {required: true, message: '请选择日期', trigger: 'change'}
                ]
            },
            showForm: false,
            form: {
                username: '',
                nickname: '',
                department: '',
                email: '',
                gender: '-1'
            },
            userList: [],
            pageSize: 15,
            total: 0,
            current: 1,
            departments: [],
            deptList: [],
        }
    },
    created() {
        this.getUserList();
        this.getDepartments();
    },
    methods: {
        cancelResetPwd() {
            this.resetPwdForm = {
                id: -1,
                newPwd: ''
            };
            this.resetPwd = false
        },
        async submitResetPwd() {
            await resetPwd(this.resetPwdForm).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '设置用户密码成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getUserList();
            this.cancelResetPwd();
        },
        resetUserPassword(id) {
            this.resetPwdForm.id = id;
            this.resetPwd = true;
        },
        changeUserStatus() {
            this.user.status ^= 1;
        },
        handleChange(curVal, direction, key) {
            this.selected = [];
            for (let i = 0; i < curVal.length; i++) {
                this.selected.push(curVal[i]);
            }
        },
        cancelConfig() {
            this.configUser = false;
            this.selected = [];
            this.roleList = [];
            this.curUserId = -1;
        },
        async submitConfig() {
            await configUserRole(this.curUserId, this.selected).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '配置用户角色成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            this.getUserList();
            this.cancelConfig();
        },
        configUserRoleById(id) {
            this.configUser = true;
            this.curUserId = id;
            getUserRole(id).then(res => {
                if (res.data.code === 200) {
                    this.selected = res.data.data.select;
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        this.roleList.push({
                            key: res.data.data.list[i].id,
                            label: res.data.data.list[i].name
                        })
                    }
                }
            }).catch(error => console.log(error));
        },
        deleteById(id) {
            deleteUser(id).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getUserList();
                }
            }).catch(error => console.log(error));
        },
        updateUserById(id) {
            getUserById(id).then(res => {
                if (res.data.code === 200) {
                    let entity = res.data.data.data;
                    this.showForm = true;
                    this.user.username = entity.username;
                    this.user.password = entity.password;
                    this.user.nickname = entity.nickname;
                    this.user.deptId = entity.deptId;
                    this.user.email = entity.email;
                    this.user.phone = entity.phone;
                    this.user.gender = entity.gender + "";
                    this.user.birth = entity.birth;
                    this.user.id = entity.id;
                    this.user.status = entity.status;
                }
            }).catch(error => console.log(error));
        },
        cancel() {
            this.user = {
                username: '',
                password: '',
                nickname: '',
                deptId: '',
                email: '',
                phone: '',
                gender: '-1',
                birth: '',
                status: 1
            }
            this.showForm = false;
        },
        submit(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.doSubmit();
                } else {
                    this.$message({
                        message: '参数校验未通过, 请重新输入',
                        type: 'info'
                    });
                }
            })
        },
        async doSubmit() {
            if (this.user.id != null) {
                await updateUser(this.user).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            } else {
                await addUser(this.user).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            }
            this.cancel();
            await this.getUserList();
            await this.getDepartments();
        },
        reset() {
            this.form = {
                username: '',
                nickname: '',
                department: '',
                email: '',
                gender: '-1'
            }
            this.current = 1;
        },
        exportAsXls() {
            exportUsersAsXls(this.form)
                .then(res => {
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
                })
                .catch(error => console.log(error));
        },
        exportAsXlsx() {
            exportUsersAsXlsx(this.form)
                .then(res => {
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
                })
                .catch(error => console.log(error));
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.current = val;
            this.getUserList();
        },
        findUserList() {
            this.current = 1;
            this.getUserList();
        },
        getUserList() {
            this.loading = true;
            getPage(this.current, this.pageSize, this.form).then(res => {
                if (res.data.code === 200) {
                    this.userList = res.data.data.list;
                    this.total = res.data.data.total;
                    this.loading = false;
                }
            }).catch(error => console.log(error));
        },
        getDepartments() {
            getDepartments().then(res => {
                if (res.data.code === 200) {
                    this.departments = res.data.data.list;
                }
            });
        }
    }
}
</script>

<style scoped>

</style>

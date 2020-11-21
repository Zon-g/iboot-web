<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline" :model="form">
                <el-form-item label="角色名称" size="small">
                    <el-input clearable v-model="form.name" placeholder="请输入角色名称"/>
                </el-form-item>

                <el-form-item style="width: 3000px;" size="small">
                    <el-button icon="el-icon-refresh" @click="reset">
                        重置条件
                    </el-button>
                    <el-button icon="el-icon-search" type="primary" @click="findPage">
                        查询角色
                    </el-button>
                    <el-button icon="el-icon-plus" type="success" v-has-permission="'role:add'"
                               @click="showForm = true; updateFlag = false">
                        添加角色
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" v-has-permission="'role:download'"
                               @click="downloadAsXls">
                        Xls文件
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" v-has-permission="'role:download'"
                               @click="downloadAsXlsx">
                        Xlsx文件
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table :data="roles" border v-loading="loading" style="width: 100%;" height="561"
                      :row-style="{height: '35px'}" :cell-style="{padding: '0px'}"
                      :header-row-style="{height: '35px'}" :header-cell-style="{padding:  '0px'}">
                <el-table-column type="index" width="50" fixed/>
                <el-table-column prop="id" label="角色id" width="70" fixed/>
                <el-table-column prop="name" label="角色名称" width="200" fixed/>
                <el-table-column prop="remark" label="角色描述" width="500"/>
                <el-table-column label="是否禁用" prop="status" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.status === 1 ? "否" : "是" }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="400"/>
                <el-table-column prop="modifyTime" label="修改时间" width="400"/>
                <el-table-column label="操作" fixed="right" width="175">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" v-has-permission="'role:update'"
                                   @click="updateRole(scope.row)"/>
                        <el-button type="danger" size="mini" icon="el-icon-delete" v-has-permission="'role:delete'"
                                   @click="deleteById(scope.row.id)"/>
                        <el-button type="warning" size="mini" icon="el-icon-s-tools" v-has-permission="'role:config'"
                                   @click="configById(scope.row.id)"/>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="current" :page-sizes="[15, 30]" :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"/>

            <el-dialog :visible.sync="showForm" :title="updateFlag ? '修改角色信息' : '添加角色信息'">
                <el-form label-width="100px" :model="role" :rules="rules" ref="role" class="demo-rulesForm">
                    <el-form-item label="角色名称" prop="name" size="small">
                        <el-input v-model="role.name"/>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="remark" size="small">
                        <el-input v-model="role.remark"/>
                    </el-form-item>
                    <el-form-item label="角色状态" prop="status" size="small">
                        <el-switch v-model="role.status === 1 " active-color="#13ce66" inactive-color="#ff4949"
                                   @change="changeRoleStatus"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel" size="small">取消</el-button>
                    <el-button type="primary" @click="submit" size="small">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog :visible.sync="configRole" title="配置角色权限">
                <el-tree :data="menus" :props="defaultProps" ref="tree"
                         show-checkbox accordion :default-checked-keys="defaultKeys" node-key="id"/>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelConfig" size="small">取消</el-button>
                    <el-button type="primary" @click="submitConfig" size="small">确定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {
    getPage, exportRoleAsXls, exportRoleAsXlsx,
    updateRole, addRole, deleteRole, configRoleMenuById
} from "@/api/System/Role";

import {getMenusByRoleId} from "@/api/System/Menu";

export default {
    name: "Role",
    data() {
        return {
            curRoleId: -1,
            menus: [],
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            defaultKeys: [],
            configRole: false,
            showForm: false,
            updateFlag: false,
            form: {
                name: ''
            },
            role: {
                id: -1,
                name: '',
                remark: '',
                status: 0
            },
            rules: {
                name: [
                    {required: true, message: '请输入角色名称', trigger: 'blur'}
                ],
                remark: [
                    {required: true, message: '请输入角色描述', trigger: 'blur'}
                ]
            },
            roles: [],
            loading: true,
            current: 1,
            total: 0,
            size: 15,
        }
    },
    created() {
        this.getRoles();
    },
    methods: {
        changeRoleStatus() {
            this.role.status ^= 1;
        },
        cancelConfig() {
            this.configRole = false;
            this.menus = [];
            this.defaultKeys = [];
        },
        async submitConfig() {
            let ans = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
            await configRoleMenuById(this.curRoleId, ans).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '角色分配权限成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getRoles();
            this.cancelConfig();
        },
        configById(id) {
            getMenusByRoleId(id).then(res => {
                if (res.data.code === 200) {
                    this.menus = res.data.data.tree;
                    this.defaultKeys = res.data.data.list;
                    this.curRoleId = id;
                }
            }).catch(error => console.log(error));
            this.configRole = true;
        },
        async deleteById(id) {
            await deleteRole(id).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getRoles();
        },
        updateRole(role) {
            this.role = {
                id: role.id,
                name: role.name,
                remark: role.remark,
                status: role.status
            }
            this.showForm = true;
            this.updateFlag = true;
        },
        downloadAsXls() {
            exportRoleAsXls(this.form)
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
                }).catch(error => console.log(error));
        },
        downloadAsXlsx() {
            exportRoleAsXlsx(this.form)
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
                }).catch(error => console.log(error));
        },
        cancel() {
            this.role = {
                name: '',
                remark: '',
                status: 0
            }
            this.showForm = false;
            this.updateFlag = false;
        },
        async submit() {
            if (this.updateFlag) {
                await updateRole(this.role).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            } else {
                await addRole(this.role).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            }
            await this.getRoles();
            this.cancel();
        },
        reset() {
            this.form.name = '';
            this.current = 1;
        },
        handleSizeChange(val) {
            this.size = val;
            this.getRoles();
        },
        handleCurrentChange(val) {
            this.current = val;
            this.getRoles();
        },
        findPage() {
            this.current = 1;
            this.getRoles();
        },
        getRoles() {
            this.loading = true;
            getPage(this.current, this.size, this.form).then(res => {
                if (res.data.code === 200) {
                    this.roles = res.data.data.list;
                    this.loading = false;
                }
            }).catch(error => console.log(error));
        }
    }
}
</script>

<style scoped>

</style>

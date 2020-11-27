<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>部门管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline" :model="form">
                <el-form-item label="部门名称" size="small">
                    <el-input clearable v-model="form.name" placeholder="请输入部门名称"/>
                </el-form-item>

                <el-form-item label="部门电话" size="small">
                    <el-input clearable v-model="form.phone" placeholder="请输入部门电话"/>
                </el-form-item>

                <el-form-item label="部门地址" size="small">
                    <el-input clearable v-model="form.address" placeholder="请输入部门地址"/>
                </el-form-item>

                <el-form-item size="small" style="width: 3000px;">
                    <el-button icon="el-icon-refresh" @click="reset">
                        重置条件
                    </el-button>
                    <el-button type="primary" icon="el-icon-search" @click="findDepartmentList">
                        查询部门
                    </el-button>
                    <el-button type="success" icon="el-icon-plus" @click="showForm = true; updateFlag = false"
                               v-has-permission="'dept:add'">
                        添加部门
                    </el-button>
                    <el-button type="warning" icon="el-icon-download" @click="downloadAsXls"
                               v-has-permission="'dept:download'">
                        xls文件
                    </el-button>
                    <el-button type="warning" icon="el-icon-download" @click="downloadAsXlsx"
                               v-has-permission="'dept:download'">
                        xlsx文件
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table border v-loading="loading" style="width: 100%;" :data="deptList" height="561"
                      :row-style="{height: '35px'}" :cell-style="{padding: '0px'}"
                      :header-row-style="{height: '35px'}" :header-cell-style="{padding:  '0px'}">
                <el-table-column type="index" width="50" fixed/>
                <el-table-column prop="id" label="部门id" width="70" fixed/>
                <el-table-column prop="name" label="部门名称" width="200" fixed/>
                <el-table-column prop="phone" label="部门电话" width="200"/>
                <el-table-column prop="address" label="部门地址" width="500"/>
                <el-table-column prop="createTime" label="记录创建时间" width="400"/>
                <el-table-column prop="modifyTime" label="记录修改时间" width="400"/>
                <el-table-column label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                                   @click="updateDepartment(scope.row)" v-has-permission="'dept:update'"/>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                                   @click="deleteById(scope.row.id)" v-has-permission="'dept:delete'"/>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="current" :page-sizes="[15, 30]" :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <el-dialog :title="updateFlag === false ? '添加部门信息' : '修改部门信息'" :visible.sync="showForm">
                <el-form :model="department" :rules="rules" ref="department" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="部门名称" prop="name" size="small">
                        <el-input v-model="department.name"/>
                    </el-form-item>
                    <el-form-item label="部门电话" prop="phone" size="small">
                        <el-input v-model="department.phone"/>
                    </el-form-item>
                    <el-form-item label="部门地址" prop="address" size="small">
                        <el-input v-model="department.address"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel" size="small">取消</el-button>
                    <el-button type="primary" @click="submit('department')" size="small">确定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {
    getPage, exportDepartmentsAsXls, exportDepartmentsAsXlsx,
    deleteDepartment, addDepartment, updateDepartment
} from '@/api/System/Department'

export default {
    name: "Department",
    data() {
        return {
            showForm: false,
            updateFlag: false,
            department: {
                name: '',
                phone: '',
                address: ''
            },
            rules: {
                id: [
                    {required: true, message: '请输入部门id', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入部门名称', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入部门电话', trigger: 'blur'}
                ],
                address: [
                    {required: true, message: '请输入部门地址', trigger: 'blur'}
                ]
            },
            loading: true,
            form: {
                name: '',
                phone: '',
                address: ''
            },
            current: 1,
            total: 0,
            size: 15,
            deptList: []
        }
    },
    created() {
        this.getDepartmentList();
    },
    methods: {
        updateDepartment(row) {
            this.department = {
                id: row.id,
                name: row.name,
                phone: row.phone,
                address: row.address
            }
            this.showForm = true;
            this.updateFlag = true;
        },
        cancel() {
            this.department = {
                name: '',
                phone: '',
                address: ''
            };
            this.showForm = false;
            this.updateFlag = false;
        },
        submit(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.doSubmit();
                } else {
                    this.$message.info("参数校验未通过, 请重新输入");
                }
            });
        },
        async doSubmit() {
            if (this.updateFlag) {
                await updateDepartment(this.department).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            } else {
                await addDepartment(this.department).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            }
            await this.getDepartmentList();
            this.cancel();
        },
        deleteById(id) {
            deleteDepartment(id).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getDepartmentList();
                }
            }).catch(error => console.log(error));
        },
        reset() {
            this.form = {
                name: '',
                phone: '',
                address: ''
            }
        },
        findDepartmentList() {
            this.current = 1;
            this.getDepartmentList();
        },
        getDepartmentList() {
            this.loading = true;
            getPage(this.current, this.size, this.form).then(res => {
                if (res.data.code === 200) {
                    this.total = res.data.data.total;
                    this.deptList = res.data.data.list;
                    this.loading = false;
                }
            }).catch(error => console.log(error));
        },
        handleSizeChange(val) {
            this.size = val;
            this.getDepartmentList();
        },
        handleCurrentChange(val) {
            this.current = val;
            this.getDepartmentList();
        },
        downloadAsXls() {
            exportDepartmentsAsXls(this.form)
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
            exportDepartmentsAsXlsx(this.form)
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
        }
    }
}
</script>

<style scoped>

</style>

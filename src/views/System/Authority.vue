<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item size="small">
                    <el-button icon="el-icon-plus" type="success" v-has-permission="'menu:add'"
                               @click="showForm = true; updateFlag = false">
                        添加菜单
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" v-has-permission="'menu:download'"
                               @click="downloadAsXls">
                        Xls文件
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" v-has-permission="'menu:download'"
                               @click="downloadAsXlsx">
                        Xlsx文件
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table :data="Menus" style="width: 100%;margin-bottom: 20px;" row-key="id"
                      border :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      v-loading="loading" height="561" :row-style="{height: '35px'}"
                      :cell-style="{padding: '0px'}" :header-row-style="{height: '35px'}"
                      :header-cell-style="{padding:  '0px'}">
                <el-table-column prop="id" label="id" width="180" fixed/>
                <el-table-column prop="menuName" label="名称" width="150" fixed/>
                <el-table-column prop="url" label="URL" width="200"/>
                <el-table-column prop="icon" label="Icon" width="240"/>
                <el-table-column prop="icon" label="图标" width="80">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="排序" width="100"/>
                <el-table-column prop="disabled" label="是否禁用" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.disabled === false ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="perms" label="权限"/>
                <el-table-column prop="type" label="类型" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.type === 0 ? '页面' : '按钮' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" v-has-permission="'menu:update'"
                                   @click="updateById(scope.row)"/>
                        <el-button type="danger" size="mini" icon="el-icon-delete" v-has-permission="'menu:delete'"
                                   @click="deleteById(scope.row.id)"/>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog :visible.sync="showForm" :title="updateFlag ? '修改菜单信息' : '添加菜单信息'">
                <el-form label-width="100px" class="demo-ruleForm" :model="menu" ref="menu" :rules="menuRules">
                    <el-form-item label="上级菜单" prop="parentId" size="small">
                        <el-select v-model="menu.parentId" placeholder="请选择上级菜单">
                            <el-option v-for="item in menuList" :key="item.id" :label="item.menuName" :value="item.id">
                                <span style="float: left">{{ item.menuName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px"
                                      class="el-tag tl-tag--success el-tag--mini el-tag--plain">{{ item.id }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单名称" prop="menuName" size="small">
                        <el-input v-model="menu.menuName"/>
                    </el-form-item>
                    <el-form-item label="菜单URL" prop="url" size="small">
                        <el-input v-model="menu.url"/>
                    </el-form-item>
                    <el-form-item label="icon" prop="icon" size="small">
                        <el-input v-model="menu.icon"/>
                    </el-form-item>
                    <el-form-item label="权限标识" prop="perms" size="small">
                        <el-input v-model="menu.perms"/>
                    </el-form-item>
                    <el-form-item label="菜单类型" size="small">
                        <el-radio v-model="menu.type" label="0">页面</el-radio>
                        <el-radio v-model="menu.type" label="1">按钮</el-radio>
                    </el-form-item>
                    <el-form-item label="菜单排序" prop="orderNum" size="small">
                        <el-input v-model="menu.orderNum"/>
                    </el-form-item>
                    <el-form-item label="菜单状态" prop="status" size="small">
                        <el-switch v-model="menu.status === 1" active-color="#13ce66" inactive-color="#ff4949"
                                   @change="changeMenuStatus"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel" size="small">取消</el-button>
                    <el-button type="primary" @click="submit" size="small">确定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {
    getMenuTree, exportAsXls, exportAsXlsx,
    deleteMenu, addMenu, updateMenu
} from "@/api/System/Menu";

export default {
    name: "Authority",
    data() {
        return {
            menuList: [],
            showForm: false,
            updateFlag: false,
            Menus: [],
            loading: true,
            menu: {
                parentId: 0,
                menuName: '',
                url: '',
                perms: '',
                icon: '',
                type: 0 + "",
                orderNum: -1,
                status: 1
            },
            menuRules: {
                parentId: [
                    {required: true, message: '请选择上级菜单id', trigger: 'change'}
                ],
                menuName: [
                    {required: true, message: '请输入菜单名称', trigger: 'blur'}
                ],
                url: [
                    {required: false, message: '请输入菜单URL', trigger: 'blur'}
                ],
                icon: [
                    {required: true, message: '请输入菜单图标', trigger: 'blur'}
                ],
                perms: [
                    {required: false, message: '请输入菜单权限', trigger: 'blur'}
                ],
                orderNum: [
                    {required: true, message: '请输入排序数字', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getMenuTree();
    },
    methods: {
        changeMenuStatus() {
            this.menu.status ^= 1;
        },
        updateById(row) {
            this.menu = {
                id: row.id,
                parentId: row.parentId,
                menuName: row.menuName,
                url: row.url,
                perms: row.perms,
                icon: row.icon,
                type: row.type + '',
                orderNum: row.orderNum,
                status: row.disabled ? 0 : 1
            };
            this.showForm = true;
            this.updateFlag = true;
        },
        cancel() {
            this.menu = {
                parentId: 0,
                menuName: '',
                url: '',
                perms: '',
                icon: '',
                type: 0 + "",
                orderNum: -1,
                status: 1
            };
            this.showForm = false;
            this.updateFlag = false;
        },
        async submit() {
            if (this.updateFlag) {
                await updateMenu(this.menu).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            } else {
                await addMenu(this.menu).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            }
            await this.getMenuTree();
            this.cancel();
        },
        async deleteById(id) {
            await deleteMenu(id).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getMenuTree();
        },
        downloadAsXls() {
            exportAsXls().then(res => {
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
            exportAsXlsx().then(res => {
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
        getMenuTree() {
            this.loading = true;
            getMenuTree().then(res => {
                if (res.data.code === 200) {
                    this.loading = false;
                    this.Menus = res.data.data.tree;
                    this.menuList = res.data.data.list;
                }
            }).catch(error => console.log(error));
        }
    }
}
</script>

<style scoped>

</style>

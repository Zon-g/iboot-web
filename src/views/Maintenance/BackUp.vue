<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运维管理</el-breadcrumb-item>
            <el-breadcrumb-item>系统备份</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row>
                <el-col :span="8">
                    <div style="margin-bottom: 10px;">
                        <el-button type="success" @click="backup" v-has-permission="'backup:backup'" size="small">
                            备份数据
                        </el-button>
                        <el-button @click="cancelSelection" size="small">
                            取消选择
                        </el-button>
                    </div>
                    <el-table ref="multipleTable" :data="tables" width="100%" border v-loading="loadingTables"
                              height="561" @selection-change="handleSelectionChange" :row-style="{height: '35px'}"
                              :cell-style="{padding: '0px'}" :header-row-style="{height: '35px'}"
                              :header-cell-style="{padding:  '0px'}">
                        <el-table-column type="selection" fixed/>
                        <el-table-column type="index" width="50" label="#" fixed/>
                        <el-table-column label="表名">
                            <template slot-scope="scope">
                                {{ scope.row }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="70">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-document-copy"
                                           @click="backupTable(scope.row)" v-has-permission="'backup:backup'"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>

                <el-col :span="8" :offset="4">
                    <div style="margin-bottom: 42px;"/>
                    <el-table border v-loading="loadingFiles" :data="files" width="100%" ref="multipleFile"
                              height="561" :row-style="{height: '35px'}"
                              :cell-style="{padding: '0px'}" :header-row-style="{height: '35px'}"
                              :header-cell-style="{padding:  '0px'}">
                        <el-table-column type="index" fixed width="50" label="#"/>
                        <el-table-column label="文件名">
                            <template slot-scope="scope">
                                {{ scope.row }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-download"
                                           @click="download(scope.row)" v-has-permission="'backup:download'"/>
                                <el-button size="mini" type="warning" icon="el-icon-refresh-left"
                                           @click="rollback(scope.row)" v-has-permission="'backup:rollback'"/>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                           @click="deleteBackupFile(scope.row)" v-has-permission="'backup:delete'"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import {
    getTables, backupAll, backupTables,
    getBackupFiles, deleteBackupFile, download, rollback
} from "@/api/Maintenance/BackUp";

export default {
    name: "BackUp",
    data() {
        return {
            loadingFiles: false,
            files: [],
            tables: [],
            selectedTables: [],
            loadingTables: false
        }
    },
    created() {
        this.getTables();
        this.getBackupFiles();
    },
    methods: {
        rollback(file) {
            this.$confirm('此操作将回滚数据库造成修改数据丢失, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                rollback(file).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '还原成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            }).catch(() => {
                this.$message({
                    message: '已取消还原',
                    type: "info"
                });
            });
        },
        download(file) {
            download(file).then(res => {
                const blob = new Blob([res.data]);
                const link = document.createElement('a');
                link.download = file;
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            }).catch(error => console.log(error));
        },
        async deleteBackupFile(file) {
            await deleteBackupFile(file).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getBackupFiles();
        },
        getBackupFiles() {
            this.loadingFiles = true;
            getBackupFiles().then(res => {
                if (res.data.code === 200) {
                    this.files = res.data.data.list;
                    this.loadingFiles = false;
                }
            }).catch(error => console.log(error));
        },
        async backupTable(table) {
            this.selectedTables.push(table);
            this.loadingTables = true;
            await backupTables(this.selectedTables).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '备份成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getBackupFiles();
            this.selectedTables = [];
            this.loadingTables = false;
        },
        async backup() {
            this.loadingTables = true;
            if (this.selectedTables.length > 0) {
                await backupTables(this.selectedTables).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '备份成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            } else {
                await backupAll().then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '备份成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
            }
            await this.cancelSelection();
            await this.getBackupFiles();
            this.loadingTables = false;
        },
        cancelSelection() {
            this.$refs.multipleTable.clearSelection();
        },
        handleSelectionChange(val) {
            this.selectedTables = val;
        },
        getTables() {
            this.loadingTables = true;
            getTables().then(res => {
                if (res.data.code === 200) {
                    this.tables = res.data.data.list;
                    this.loadingTables = false;
                }
            }).catch(error => console.log(error));
        }
    }
}
</script>

<style scoped>

</style>

<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运维管理</el-breadcrumb-item>
            <el-breadcrumb-item>附件管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline" :model="condition">
                <el-form-item label="附件类型" size="small">
                    <el-select v-model="condition.type" placeholder="请选择附件类型">
                        <el-option v-for="item in types" :key="item" :label="item" :value="item">
                            <span>{{ item }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 3000px;" size="small">
                    <el-button icon="el-icon-refresh" @click="reset">
                        重置条件
                    </el-button>
                    <el-button icon="el-icon-search" type="primary" @click="getPage">
                        查询附件
                    </el-button>
                    <el-button icon="el-icon-download" type="success" @click="downloadBatch"
                               v-has-permission="'attachment:download'">
                        批量下载
                    </el-button>
                    <el-button icon="el-icon-delete" type="danger" @click="deleteBatch"
                               v-has-permission="'attachment:delete'">
                        批量删除
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table border width="100%" height="561" ref="attachments" v-loading="loading" :data="attachments"
                      @selection-change="handleSelectionChange" :row-style="{height: '35px'}"
                      :cell-style="{padding: '0px'}" :header-row-style="{height: '35px'}"
                      :header-cell-style="{padding:  '0px'}">
                <el-table-column type="selection" fixed/>
                <el-table-column type="index" width="50" label="#" fixed/>
                <el-table-column prop="filename" label="文件名" width="150" fixed/>
                <el-table-column prop="format" label="文件格式" width="100"/>
                <el-table-column prop="size" label="文件大小" width="200">
                    <template slot-scope="scope">
                        {{ autoAdapt(scope.row.size) }}
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="附件类型" width="200"/>
                <el-table-column prop="absolutePath" label="绝对路径"/>
                <el-table-column prop="lastModify" label="上次修改时间" width="200"/>
                <el-table-column label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <!--suppress JSUnresolvedVariable -->
                        <el-button size="mini" type="primary" icon="el-icon-download"
                                   @click="downloadFile(scope.row.absolutePath)"
                                   v-has-permission="'attachment:download'"/>
                        <!--suppress JSUnresolvedVariable -->
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                                   @click="deleteFile(scope.row.absolutePath)"
                                   v-has-permission="'attachment:delete'"/>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="current" :page-sizes="[15, 30]" :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"/>
        </el-card>
    </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
import {
    getTypes, getPage, downloadFile,
    deleteFile, deleteBatch, downloadBatch
} from "@/api/Maintenance/Attachment";

export default {
    name: "Attachment",
    data() {
        return {
            selected: [],
            attachments: [],
            total: 0,
            size: 15,
            current: 1,
            condition: {
                type: ''
            },
            types: [],
            loading: false
        }
    },
    created() {
        this.getAttachmentTypes();
        this.getAttachmentPage();
    },
    methods: {
        handleSelectionChange(val) {
            this.selected = val;
        },
        async deleteBatch() {
            if (this.selected.length > 0) {
                let files = [];
                for (let i = 0; i < this.selected.length; i++) {
                    files.push(this.selected[i].absolutePath);
                }
                await deleteBatch(files).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                }).catch(error => console.log(error));
                await this.getPage();
            } else {
                this.$message({
                    message: '请选择记录',
                    type: 'info'
                });
            }
        },
        async downloadBatch() {
            if (this.selected.length > 0) {
                let files = [];
                for (let i = 0; i < this.selected.length; i++) {
                    files.push(this.selected[i].absolutePath);
                }
                await downloadBatch(files).then(res => {
                    const blob = new Blob([res.data]);
                    const filename = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.zip';
                    const link = document.createElement('a');
                    link.download = filename;
                    link.style.display = 'none';
                    link.href = URL.createObjectURL(blob);
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                }).catch(error => console.log(error));
                await this.getPage();
            } else {
                this.$message({
                    message: '请选择记录',
                    type: 'info'
                });
            }
        },
        async deleteFile(file) {
            await deleteFile(file).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getAttachmentPage();
        },
        downloadFile(file) {
            // 这里切割字符串的方式跟文件所在服务器操作系统有关, 若为Linux服务器, 则切割符号应该是'/'
            let paths = file.split('\\');
            let len = paths.length;
            downloadFile(file).then(res => {
                    const blob = new Blob([res.data]);
                    const link = document.createElement('a');
                    link.download = paths[len - 1];
                    link.style.display = 'none';
                    link.href = URL.createObjectURL(blob);
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                }
            ).catch(error => console.log(error));
        },
        autoAdapt(size) {
            let unit = ['B', 'KB', 'MB', 'GB', 'TB'];
            let index = 0;
            while (size > 1024) {
                size /= 1024;
                index++;
            }
            return Math.round((size + Number.EPSILON) * 100) / 100 + unit[index];
        }
        ,
        getPage() {
            this.current = 1;
            this.getAttachmentPage();
        }
        ,
        reset() {
            this.condition = {
                type: ''
            }
            this.current = 1;
        }
        ,
        getAttachmentPage() {
            this.loading = true;
            getPage(this.current, this.size, this.condition).then(res => {
                if (res.data.code === 200) {
                    this.attachments = res.data.data.list;
                    this.total = res.data.data.total;
                    this.loading = false;
                }
            }).catch(error => console.log(error));
        }
        ,
        handleCurrentChange(val) {
            this.current = val;
            this.getAttachmentPage();
        }
        ,
        handleSizeChange(val) {
            this.size = val;
            this.getAttachmentPage();
        }
        ,
        getAttachmentTypes() {
            getTypes().then(res => {
                if (res.data.code === 200) {
                    this.types = res.data.data.list;
                }
            }).catch(error => console.log(error));
        }
    }
}
</script>

<style scoped>

</style>

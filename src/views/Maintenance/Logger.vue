<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运维管理</el-breadcrumb-item>
            <el-breadcrumb-item>操作日志</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline" :model="condition">
                <el-form-item label="用户名" size="small">
                    <el-input clearable placeholder="请输入用户名" v-model="condition.username"/>
                </el-form-item>
                <el-form-item label="操作类型" size="small">
                    <el-select v-model="condition.operation" placeholder="请选择操作类型">
                        <el-option v-for="item in operations" :key="item" :label="item" :value="item">
                            <span>{{ item }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围" size="small">
                    <el-date-picker type="daterange" align="right" unlink-panels range-seperator="至"
                                    v-model="condition.dateRange" start-placeholder="开始日期"
                                    end-placeholder="结束日期" :picker-options="pickerOptions"/>
                </el-form-item>
                <el-form-item style="width: 3000px;" size="small">
                    <el-button icon="el-icon-refresh" @click="resetCondition">
                        重置条件
                    </el-button>
                    <el-button icon="el-icon-search" type="primary" @click="findPage">
                        查询记录
                    </el-button>
                    <el-button icon="el-icon-delete" type="danger" @click="clearAll"
                               v-has-permission="'logger:truncate'">
                        清空日志
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" @click="exportAsXls"
                               v-has-permission="'logger:download'">
                        Xls文件
                    </el-button>
                    <el-button icon="el-icon-download" type="warning" @click="exportAsXlsx"
                               v-has-permission="'logger:download'">
                        Xlsx文件
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table :data="logs" border v-loading="loading" style="width: 100%;" height="575"
                      :row-style="{height: '35px'}" :cell-style="{padding: '0px'}"
                      :header-row-style="{height: '35px'}" :header-cell-style="{padding: '0px'}">
                <el-table-column prop="id" label="记录id" width="70" fixed/>
                <el-table-column prop="user" label="角色名" width="150" fixed/>
                <el-table-column prop="method" label="操作方法" width="500"/>
                <el-table-column prop="params" label="方法参数" width="500">
                    <template slot-scope="scope">
                        {{ scope.row.params.length > 60 ? scope.row.params.substr(0, 60) + '...' : scope.row.params }}
                    </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作类型" width="120"/>
                <el-table-column prop="description" label="操作描述" width="270"/>
                <el-table-column prop="createTime" label="记录创建时间" width="200"/>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="current" :page-sizes="[15, 30]" :page-size="size"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"/>
        </el-card>
    </div>
</template>

<script>
import {
    getLoggerPage, getOperations, clearAll,
    exportAsXls, exportAsXlsx
} from '@/api/Maintenance/Logger';

export default {
    name: "Logger",
    data() {
        return {
            operations: [],
            total: 0,
            size: 15,
            current: 1,
            loading: false,
            logs: [],
            username: '',
            condition: {
                username: '',
                operation: '',
                dateRange: [],
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
            },
        }
    },
    created() {
        this.getPage();
        this.getOperations();
    },
    methods: {
        async exportAsXls() {
            let con = {
                username: this.condition.username,
                operation: this.condition.operation,
                startTime: this.condition.dateRange[0],
                endTime: this.condition.dateRange[1]
            };
            await exportAsXls(con)
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
            await this.getPage();
        },
        async exportAsXlsx() {
            let con = {
                username: this.condition.username,
                operation: this.condition.operation,
                startTime: this.condition.dateRange[0],
                endTime: this.condition.dateRange[1]
            };
            await exportAsXlsx(con)
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
            await this.getPage();
        },
        async clearAll() {
            await clearAll().then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            await this.getPage();
        },
        getOperations() {
            getOperations().then(res => {
                if (res.data.code === 200) {
                    this.operations = res.data.data.list;
                }
            }).catch(error => console.log(error));
        },
        resetCondition() {
            this.condition = {
                username: '',
                operation: '',
                dateRange: [],
            }
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
        findPage() {
            this.current = 1;
            this.getPage();
        },
        getPage() {
            this.loading = true;
            let con = {
                username: this.condition.username,
                operation: this.condition.operation,
                startTime: this.condition.dateRange[0],
                endTime: this.condition.dateRange[1]
            };
            getLoggerPage(this.current, this.size, con).then(res => {
                if (res.data.code === 200) {
                    this.logs = res.data.data.list;
                    this.total = res.data.data.total;
                    this.loading = false;
                }
            }).catch(error => console.log(error));
        }
    }
}
</script>

<style scoped>

</style>

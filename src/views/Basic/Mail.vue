<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>基本功能</el-breadcrumb-item>
            <el-breadcrumb-item>邮件管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">

        </el-card>
    </div>
</template>

<script>
export default {
    name: "Mail"
}
</script>

<style scoped>

</style>

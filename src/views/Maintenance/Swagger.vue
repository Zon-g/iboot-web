<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运维管理</el-breadcrumb-item>
            <el-breadcrumb-item>Swagger文档</el-breadcrumb-item>
        </el-breadcrumb>
        <iframe src="http://localhost:8081/swagger-ui.html" scrolling="auto" frameborder="0"
                id="iframe" width="100%" height="804px"></iframe>
    </div>
</template>

<script>
export default {
    name: "APIDocument"
}
</script>

<style scoped>

</style>

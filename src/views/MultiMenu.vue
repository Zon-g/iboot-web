<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>多级菜单</el-breadcrumb-item>
            <el-breadcrumb-item>多级菜单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <span>多级菜单展示</span>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "MultiMenu"
}
</script>

<style scoped>

</style>

<template>
    <div>
        <el-breadcrumb separator="/" style="padding-left: 10px; padding-bottom: 10px; font-size: 12px;">
            <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>开发管理</el-breadcrumb-item>
            <el-breadcrumb-item>Redis监控</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row>
                <el-col :span="3" :offset="3" class="logo">
                    <img src="../../assets/RedisMonitor.png" width="162" height="51"/>
                </el-col>
                <el-col :span="15">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                             :router="true">
                        <el-menu-item index="1" :route="'/redisIndex'">首页</el-menu-item>
                        <el-menu-item index="2" :route="'/parameter'">连接参数</el-menu-item>
                        <el-menu-item index="3" :route="'/cache'">缓存监控</el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18" :offset="3">
                    <router-view/>
                </el-col>
            </el-row>
            <div style="height: 100px;"/>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Redis",
    data() {
        return {
            activeIndex: '1'
        }
    }
}
</script>

<style scoped>
a {
    text-decoration: none;
}

a:visited {
    text-decoration: none;
}

a:hover {
    text-decoration: none;
}

a:active {
    text-decoration: none;
}
</style>

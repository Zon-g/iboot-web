<template>
    <div>
        <div class="outline">
            <span class="line">Redis基本参数</span>
        </div>
        <table style="width: 100%; word-break: break-all" class="table">
            <tr class="alter">
                <td style="width: 200px;">数据库</td>
                <td>{{ properties.database }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">URL</td>
                <td>{{ properties.url }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px">Host</td>
                <td>{{ properties.host }}</td>
            </tr>
            <tr>
                <td style="width: 200px">密码</td>
                <td>{{ properties.password }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px">端口</td>
                <td>{{ properties.port }}</td>
            </tr>
            <tr>
                <td style="width: 200px">是否启用SSL</td>
                <td>{{ properties.ssl }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px">连接超时</td>
                <td>{{ properties.timeout }}</td>
            </tr>
            <tr>
                <td style="width: 200px">客户端名称</td>
                <td>{{ properties.clientName }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px">哨兵</td>
                <td style="padding: 0">
                    <table style="width: 100%; word-break: break-all; border: hidden">
                        <tr class="alter">
                            <td style="width: 200px">主节点</td>
                            <td>{{ properties.sentinel != null ? properties.sentinel.master : '' }}</td>
                        </tr>
                        <tr class="alter">
                            <td style="width: 200px">从节点</td>
                            <td>
                                <ul style="list-style: none" v-if="properties.sentinel">
                                    <li v-for="item in properties.sentinel.nodes">{{ item }}</li>
                                </ul>
                            </td>
                        </tr>
                        <tr class="alter">
                            <td style="width: 200px">密码</td>
                            <td>{{ properties.sentinel != null ? properties.sentinel.password : '' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="width: 200px">分簇</td>
                <td style="padding: 0">
                    <table style="width: 100%; word-break: break-all; border: hidden">
                        <tr>
                            <td style="width: 200px">节点</td>
                            <td>
                                <ul style="list-style: none" v-if="properties.cluster">
                                    <li v-for="item in properties.cluster.nodes">{{ item }}</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 200px">最大重定向数</td>
                            <td>{{ properties.cluster != null ? properties.cluster.maxRedirects : '' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="outline">
            <span class="line">Jedis连接池</span>
        </div>
        <table style="width: 100%; word-break: break-all" class="table">
            <tr class="alter">
                <td style="width: 200px">连接池</td>
                <td style="padding: 0">
                    <table style="width: 100%; word-break: break-all; border: hidden">
                        <tr>
                            <td style="width: 200px">最大空闲连接数</td>
                            <td>{{ properties.jedis.pool != null ? properties.jedis.pool.maxIdle : '' }}</td>
                        </tr>
                        <tr>
                            <td style="width: 200px">最小空闲连接数</td>
                            <td>{{ properties.jedis.pool != null ? properties.jedis.pool.minIdle : '' }}</td>
                        </tr>
                        <tr>
                            <td style="width: 200px">最大可用连接数</td>
                            <td>{{ properties.jedis.pool != null ? properties.jedis.pool.maxActive : '' }}</td>
                        </tr>
                        <tr>
                            <td style="width: 200px">阻塞等待最长时间</td>
                            <td>{{ properties.jedis.pool != null ? properties.jedis.pool.maxWait : '' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="outline">
            <span class="line">Lettuce连接池</span>
        </div>
        <table style="width: 100%; word-break: break-all" class="table">
            <tr class="alter">
                <td style="width: 200px">分簇</td>
                <td style="padding: 0;">
                    <table style="width: 100%; word-break: break-all; border: hidden">
                        <tr class="alter">
                            <td style="width: 200px">刷新</td>
                            <td style="padding: 0">
                                <table style="width: 100%; word-break: break-all; border: hidden">
                                    <tr class="alter">
                                        <td style="width: 200px">周期</td>
                                        <td>{{ properties.lettuce.cluster.refresh.period }}</td>
                                    </tr>
                                    <tr class="alter">
                                        <td style="width: 200px">是否自适应</td>
                                        <td>{{ properties.lettuce.cluster.refresh.adaptive }}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="width: 200px">连接池</td>
                <td style="padding: 0;">
                    <table style="width: 100%; word-break: break-all; border: hidden">
                        <tr>
                            <td style="width: 200px">最大空闲连接数</td>
                            <td>{{ properties.lettuce.pool.maxIdle }}</td>
                        </tr>
                        <tr>
                            <td style="width: 200px">最小空闲连接数</td>
                            <td>{{ properties.lettuce.pool.minIdle }}</td>
                        </tr>
                        <tr>
                            <td style="width: 200px">最大可用连接数</td>
                            <td>{{ properties.lettuce.pool.maxActive }}</td>
                        </tr>
                        <tr>
                            <td style="width: 200px">阻塞等待最长时间</td>
                            <td>{{ properties.lettuce.pool.maxWait }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr class="alter">
                <td style="width: 200px">关闭超时</td>
                <td>{{ properties.lettuce.shutdownTimeout }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import {getConnectionParams} from '@/api/Maintenance/Monitor'

export default {
    name: 'Parameters',
    data() {
        return {
            properties: {
                clientName: '',
                cluster: {
                    nodes: [],
                    maxRedirects: ''
                },
                database: 0,
                host: '',
                jedis: {
                    pool: {
                        maxIdle: '',
                        minIdle: '',
                        maxActive: '',
                        maxWait: '',
                        timeBetweenEvictionRuns: ''
                    }
                },
                lettuce: {
                    shutdownTimeout: '',
                    pool: {
                        maxIdle: '',
                        minIdle: '',
                        maxActive: '',
                        maxWait: '',
                        timeBetweenEvictionRuns: ''
                    },
                    cluster: {
                        refresh: {
                            period: '',
                            adaptive: ''
                        }
                    }
                },
                password: '',
                port: '',
                sentinel: {
                    master: '',
                    nodes: [],
                    password: ''
                },
                ssl: '',
                timeout: '',
                url: ''
            }
        }
    },
    created() {
        getConnectionParams().then(res => {
            if (res.data.code === 200) {
                this.properties = res.data.data.properties
            }
        }).catch(error => console.log(error))
    }
}
</script>

<style scoped>
.outline {
    height: 40px;

}

.line {
    font-size: 20px;
    font-weight: normal;
    position: relative;
    top: 5px;
}
</style>

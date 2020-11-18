<template>
    <div>
        <table style="width: 100%; word-break: break-all" class="table">
            <tr class="alter">
                <th style="width: 200px;">属性名</th>
                <th>属性值</th>
            </tr>
            <tr>
                <td style="width: 200px;">Redis Monitor版本</td>
                <td>{{ info.version }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">Spring版本</td>
                <td>{{ info.springVersion }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">Spring Boot版本</td>
                <td>{{ info.springBootVersion }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">操作系统名称</td>
                <td>{{ info.osName }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">操作系统版本</td>
                <td>{{ info.osVersion }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">操作系统架构</td>
                <td>{{ info.osArch }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">处理器架构</td>
                <td>{{ info.processorArchitecture }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">处理器核心数</td>
                <td>{{ info.numberOfProcessors }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">Java Home</td>
                <td>{{ info.javaHome }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">Java版本</td>
                <td>{{ info.javaVersion }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">Java供应商</td>
                <td>{{ info.javaVendor }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">Java供应商网址</td>
                <td>{{ info.javaVendorURL }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">运行时环境名称</td>
                <td>{{ info.runtimeName }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">虚拟机名称</td>
                <td>{{ info.vmName }}</td>
            </tr>
            <tr>
                <td style="width: 200px;">虚拟机信息</td>
                <td>{{ info.vmInfo }}</td>
            </tr>
            <tr class="alter">
                <td style="width: 200px;">Class Path</td>
                <td>
                    <ul style="list-style: none">
                        <li v-for="item in info.classpath">{{ item }}</li>
                    </ul>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import {getIndex} from '@/api/Maintenance/Monitor'

export default {
    name: 'Index',
    data() {
        return {
            info: {}
        }
    },
    created() {
        getIndex().then(res => {
            if (res.data.code === 200) {
                this.info = res.data.data.list
            }
        }).catch(error => console.log(error))
    }
}
</script>

<style scoped>

</style>

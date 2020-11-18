<template>
    <div>
        <el-row style="margin-top: 1px;" :gutter="10">
            <el-col>
                <el-button icon="el-icon-refresh" type="success" @click="getKeys">刷新</el-button>
                <el-button icon="el-icon-delete" type="danger" @click="deleteAll">清除</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top: 1px;" :gutter="10">
            <el-col :span="12">
                <el-table :data="keys" v-loading="loading" style="width: 100%;" height="700" border stripe
                          :row-style="{height: '35px'}" :cell-style="{padding: '0px'}"
                          :header-row-style="{height: '35px'}" :header-cell-style="{padding: '0px'}">
                    <el-table-column prop="key" label="键" width="255" fixed/>
                    <el-table-column prop="type" label="类型" width="70"/>
                    <el-table-column prop="expire" label="过期时间"/>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" icon="el-icon-view" type="primary"
                                       @click="getKey(scope.row.key, scope.row.type)"/>
                            <el-button size="mini" icon="el-icon-edit" type="warning"
                                       @click="updateKey(scope.row.key, scope.row.type)"/>
                            <el-button size="mini" icon="el-icon-delete" type="danger"
                                       @click="deleteKey(scope.row.key)"/>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <el-input type="textarea" :rows="30" style="width: 100%;" v-model="value" :readonly="readonly"/>
                <div style="position: relative; float: right" v-if="update">
                    <el-button type="primary" @click="submit">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {
    getKeys, getKey, deleteAll,
    deleteKey, updateSetAndList, updateHash, updateString
} from '@/api/Maintenance/Monitor'

export default {
    name: 'Cache',
    data() {
        return {
            loading: false,
            keys: [],
            value: null,
            keyName: '',
            type: '',
            update: false,
            readonly: false
        }
    },
    created() {
        this.getKeys()
    },
    methods: {
        getKeys() {
            getKeys().then(res => {
                if (res.data.code === 200) {
                    this.keys = res.data.data.list
                }
            }).catch(error => console.log(error))
        },
        getKey(key, type) {
            this.readonly = true
            this.update = false
            getKey(key, type).then(res => {
                if (res.data.code === 200) {
                    if (type === 'hash') {
                        this.value = JSON.stringify(res.data.data.key)
                    } else if (type === 'set' || type === 'list') {
                        this.value = this.trimForArray(JSON.stringify(res.data.data.key))
                    } else {
                        this.value = res.data.data.key
                    }
                }
            }).catch(error => console.log(error))
        },
        async deleteAll() {
            this.update = false
            await deleteAll().then(res => {
                if (res.data.code === 200) {
                    this.value = null
                    this.$message.info('删除成功')
                }
            }).catch(error => console.log(error))
            await this.getKeys()
        },
        updateKey(key, type) {
            this.getKey(key, type)
            this.readonly = false
            this.update = true
            this.keyName = key
            this.type = type
        },
        async deleteKey(key) {
            this.update = false
            this.value = null
            await deleteKey(key).then(res => {
                if (res.data.code === 200) {
                    this.$message.info('删除成功')
                }
            }).catch(error => console.log(error))
            await this.getKeys()
        },
        async submit() {
            this.update = false
            switch (this.type) {
                case 'string':
                    await updateString(this.keyName, this.value.toString()).then(res => {
                        if (res.data.code === 200) {
                            this.$message.info('修改成功')
                        }
                    }).catch(error => console.log(error))
                    break
                case 'list':
                case 'set':
                    await updateSetAndList(this.keyName, this.type, this.value).then(res => {
                        if (res.data.code === 200) {
                            this.$message.info('修改成功')
                        }
                    }).catch(error => console.log(error))
                    break
                case 'hash':
                    await updateHash(this.keyName, JSON.parse(this.value)).then(res => {
                        if (res.data.code === 200) {
                            this.$message.info('修改成功')
                        }
                    }).catch(error => console.log(error))
                    break
                default:
                    console.log('Wrong type...')
            }
            this.value = null
            await this.getKeys()
        },
        cancel() {
            this.update = false
            this.value = null
        },
        trimForArray(value) {
            let start = 0, end = value.length - 1
            while (value.charAt(start) === '[') start++
            while (value.charAt(end) === ']') end--
            return value.substring(start, end + 1)
        }
    }
}
</script>

<style scoped>

</style>

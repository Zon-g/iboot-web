<template>
    <el-container class="main_container">
        <el-header>
            <div class="left_box">
                <img src="../assets/logo.png" alt=""/>
                <span>管理系统</span>
            </div>

            <div class="right_box">
                <el-dropdown>
                    <img :src="avatar" alt=""/>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-s-custom">
                            <span @click="updateUserInfo">修改信息</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-key">
                            <span @click="updateUserPwd">修改密码</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-lock">
                            <span @click="lockScreen">锁屏休息</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-switch-button">
                            <span @click="logout">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="isCollapsed ? '64px': '200px'">
                <div class="toggle_box" @click="collapse">|||</div>
                <el-menu class="el-menu-vertical-demo" @open="handleOpen"
                         @close="handleClose" background-color="#001529" text-color="#fff"
                         active-text-color="#ffd04b" :collapse="isCollapsed" :collapse-transition="false"
                         :unique-opened="true" :router="true" :default-active="activePath">
                    <MenuTree :menu-list="this.MenuList"></MenuTree>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>

            <el-drawer :before-close="handleInfoClose" :visible.sync="updateInfoDialog"
                       direction="rtl" custom-class="demo-drawer" ref="drawer" size="40%">
                <div class="demo-drawer__content">
                    <el-form :model="user" label-width="100px">
                        <el-form-item label="用户头像">
                            <el-row>
                                <el-col :span="12">
                                    <el-avatar :src="avatarURL" size="large"/>
                                </el-col>
                                <el-col :span="12">
                                    <el-button size="small" type="primary" @click="updateAvatar">点击上传</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="用户名">
                            <el-input v-model="user.username"/>
                        </el-form-item>
                        <el-form-item label="用户昵称">
                            <el-input v-model="user.nickname"/>
                        </el-form-item>
                        <el-form-item label="用户邮箱">
                            <el-input v-model="user.email"/>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <el-input v-model="user.phone"/>
                        </el-form-item>
                        <el-form-item label="性    别">
                            <el-radio v-model="user.gender" label="1">
                                <span class="el-tag el-tag--success el-tag--mini el-tag--plain">男</span>
                            </el-radio>
                            <el-radio v-model="user.gender" label="0">
                                <span class="el-tag el-tag--success el-tag--mini el-tag--plain">女</span>
                            </el-radio>
                            <el-radio v-model="user.gender" label="-1">
                                <span class="el-tag el-tag--success el-tag--mini el-tag--plain">保密</span>
                            </el-radio>
                        </el-form-item>
                        <el-form-item label="出生日期">
                            <el-date-picker type="date" placeholder="请选择日期" v-model="user.birth" style="width: 100%;"/>
                        </el-form-item>
                    </el-form>
                    <div style="position: fixed; bottom: 20px; right: 30px;">
                        <el-button @click="cancelUpdateInfo">取消</el-button>
                        <el-button type="primary" @click="submitUpdateInfo">确定</el-button>
                    </div>
                </div>
            </el-drawer>

            <el-drawer :before-close="handlePwdClose" :visible.sync="updatePwdDialog"
                       direction="ttb" size="50%">
                <div class="demo-drawer__content" style="position: fixed; left: 25%; width: 50%">
                    <el-steps :active="active" finish-status="success">
                        <el-step title="验证密码"/>
                        <el-step title="设置新密码"/>
                        <el-step title="完成"/>
                    </el-steps>
                    <div style="margin-top: 10%;">
                        <el-input v-model="oldPassword" placeholder="请输入原密码" v-if="active === 0" type="password"/>
                        <el-input v-model="newPassword" placeholder="请输入新密码" v-if="active === 1" type="password"/>
                        <el-input v-model="confirmNewPassword" placeholder="请确认新密码" v-if="active === 1"
                                  type="password"/>
                        <span v-if="active === 2"
                              style="font-size: 30px;font-weight: bold;display: flex; justify-content: space-evenly; flex-wrap: wrap">
                            设置完成~~~
                        </span>
                    </div>
                    <div style="position: fixed; bottom: 52%; right: 25%">
                        <el-button type="primary" @click="nextStep" v-if="active < 2">下一步</el-button>
                        <el-button type="primary" @click="finishUpdatePwd" v-if="active === 2">确定</el-button>
                    </div>
                </div>
            </el-drawer>

            <el-drawer :visible.sync="screenLock" direction="ttb" size="100%" :with-header="false">
                <div style="width: 400px; position: fixed; top: 30%; left: 50%; transform: translateX(-50%)">
                    <el-input v-model="pwd" placeholder="请输入密码" type="password"/>
                    <div style="position: fixed; left: 60%; transform: translate(-100%, 100%)">
                        <el-button type="primary" @click="verify">解锁</el-button>
                    </div>
                </div>
            </el-drawer>

            <el-dialog title="上传用户头像" :visible.sync="uploadAvatar" width="30%">
                <span>
                    <el-upload class="upload-demo" ref="upload" drag action=""
                               :limit="1" :auto-upload="false" :on-remove="handleFileRemove">
                        <i class="el-icon-upload"/>
                        <div class="el-upload__text">点击上传</div>
                        <div class="el-upload__tip">只能上传png/jpg/jpeg/tif/gif/bmp文件</div>
                    </el-upload>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelAvatarUpload">取消</el-button>
                    <el-button type="primary" @click="handleAvatarUpload">确定</el-button>
                </span>
            </el-dialog>

        </el-container>
    </el-container>
</template>

<script>
import MenuTree from "@/components/MenuTree";
import {getMenus} from "@/api/System/Menu";
import {
    getUserById, resetPwd, updateUserInfo,
    verifyPwd
} from "@/api/System/User";
import axios from 'axios';
import {baseURL} from "@/api/BaseURL";

export default {
    name: "Main",
    data() {
        return {
            dateTimePicker: '',
            uploadAvatar: false,
            pwd: '',
            screenLock: false,
            active: 0,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            updatePwdDialog: false,
            user: {
                id: -1,
                username: '',
                nickname: '',
                email: '',
                avatar: '',
                phone: '',
                gender: '',
                birth: ''
            },
            updateInfoDialog: false,
            isCollapsed: false,
            activePath: '',
            MenuList: this.$store.state.menus,
            avatarURL: '',
            avatar: ''
        }
    },
    components: {
        MenuTree
    },
    created() {
        // Though a warning here, just ignore it.
        getMenus(this.$store.state.user).then(res => {
            if (res.data.code === 200) {
                this.$store.commit("setMenus", res.data.data.menus);
                this.$store.commit("setPerms", res.data.data.perms);
                this.MenuList = this.$store.state.menus;
                if (this.$store.state.user.avatar != null) {
                    let arr = this.$store.state.user.avatar.split('\\');
                    let len = arr.length;
                    this.avatar = baseURL() + '/avatar/' + arr[len - 1];
                } else {
                    this.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
                }
            }
        }).catch(error => console.log(error));
    },
    methods: {
        handleFileRemove() {
            this.$message.info("已删除选择所选文件");
        },
        handleAvatarUpload() {
            let params = new FormData();
            params.append("file", this.$refs.upload.uploadFiles[0].raw);
            axios.post(baseURL() + '/user/avatarUpload', params, {
                headers: {
                    'Content-Type': 'multipart/form-data; charset=utf-8',
                    'Authorization': this.$store.state.token
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message.success('上传头像成功');
                    this.user.avatar = res.data.data.path;
                    let len = this.user.avatar.split('\\').length;
                    this.avatarURL = baseURL() + '/avatar/' + this.user.avatar.split('\\')[len - 1];
                    this.uploadAvatar = false;
                    this.$refs.upload.uploadFiles.length = 0;
                }
            }).catch(error => console.log(error));
        },
        cancelAvatarUpload() {
            this.uploadAvatar = false;
        },
        updateAvatar() {
            this.uploadAvatar = true;
        },
        verify() {
            verifyPwd(this.$store.state.user.id, this.pwd).then(res => {
                if (res.data.code === 200) {
                    if (res.data.data.equals) {
                        this.$message({
                            message: '解锁成功',
                            type: 'success'
                        });
                        this.screenLock = false;
                        this.pwd = '';
                    } else {
                        this.$message({
                            message: '密码错误,请重新输入',
                            type: 'error'
                        });
                        this.pwd = '';
                    }
                }
            }).catch(error => console.log(error));
        },
        lockScreen() {
            this.screenLock = true;
        },
        nextStep() {
            if (this.active === 0) {
                if (this.oldPassword.length === 0) {
                    this.$message({
                        message: '旧密码不能为空',
                        type: 'error'
                    });
                } else {
                    verifyPwd(this.$store.state.user.id, this.oldPassword).then(res => {
                        if (res.data.code === 200) {
                            if (res.data.data.equals) {
                                this.active += 1;
                            } else {
                                this.$message({
                                    message: '旧密码不正确, 请重新输入',
                                    type: 'error'
                                });
                            }
                        }
                    }).catch(error => console.log(error));
                }
            } else if (this.active === 1) {
                if (this.newPassword.length === 0) {
                    this.$message({
                        message: '新密码不能为空',
                        type: 'error'
                    });
                } else if (this.confirmNewPassword.length === 0) {
                    this.$message({
                        message: '确认密码不能为空',
                        type: 'error'
                    });
                } else if (this.newPassword !== this.confirmNewPassword) {
                    this.$message({
                        message: '两次密码不同, 请重新输入',
                        type: 'error'
                    });
                } else {
                    resetPwd({
                        id: this.$store.state.user.id,
                        password: this.newPassword
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.active += 1;
                        }
                    }).catch(error => console.log(error));
                }
            }
        },
        finishUpdatePwd() {
            this.updatePwdDialog = false;
            this.oldPassword = '';
            this.active = 0;
            this.newPassword = '';
            this.confirmNewPassword = '';
        },
        updateUserPwd() {
            this.updatePwdDialog = true;
        },
        updateUserInfo() {
            this.updateInfoDialog = true;
            getUserById(this.$store.state.user.id).then(res => {
                if (res.data.code === 200) {
                    this.user.id = res.data.data.data.id;
                    this.user.username = res.data.data.data.username;
                    this.user.nickname = res.data.data.data.nickname;
                    this.user.email = res.data.data.data.email;
                    if (res.data.data.data.avatar === null) {
                        this.avatarURL = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
                    } else {
                        this.user.avatar = res.data.data.data.avatar;
                        let arr = this.user.avatar.split('\\');
                        let len = arr.length;
                        this.avatarURL = baseURL() + '/avatar/' + arr[len - 1];
                    }
                    this.user.phone = res.data.data.data.phone;
                    this.user.gender = res.data.data.data.gender + '';
                    this.user.birth = res.data.data.data.birth;
                }
            }).catch(error => console.log(error));
        },
        cancelUpdateInfo() {
            this.user = {
                id: -1,
                username: '',
                nickname: '',
                email: '',
                avatar: '',
                phone: '',
                gender: '',
                birth: ''
            };
            this.updateInfoDialog = false;
        },
        submitUpdateInfo() {
            updateUserInfo(this.user).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                }
            }).catch(error => console.log(error));
            this.cancelUpdateInfo();
        },
        handlePwdClose(done) {
            this.$confirm('确认关闭?')
                .then(_ => {
                    done();
                }).catch(_ => {
            });
            this.finishUpdatePwd();
        },
        handleInfoClose(done) {
            this.$confirm('确认关闭?')
                .then(_ => {
                    done();
                }).catch(_ => {
            });
        },
        logout() {
            this.$store.commit("delMenus");
            this.$store.commit("delPerms");
            this.$store.commit("delToken");
            this.$store.commit("delUser");
            this.$router.push("/");
        },
        collapse() {
            this.isCollapsed = !this.isCollapsed
        },
        handleOpen(key, keyPath) {
        },
        handleClose(key, keyPath) {
        }
    }
}
</script>

<style lang="less" scoped>
.main_container {
    height: 100%;
}

.el-header {
    background-color: #001529;
    display: flex;
    justify-content: space-between;
    color: #FFFFFF;
    align-items: center;
    font-size: 20px;

    .left_box {
        display: flex;
        align-items: center;

        img {
            width: 60px;
            height: 60px;
        }

        span {
            margin-left: 15px;
        }
    }

    .right_box {
        .el-dropdown > img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: white;
            margin: 0 15px 0 0;
            background-size: contain;
        }
    }
}

.el-aside {
    background-color: #001529;

    .el-menu {
        border-right: none;
    }

    .toggle_box {
        background-color: #001529;
        font-size: 15px;
        font-weight: bold;
        line-height: 25px;
        color: white;
        letter-spacing: 0.2em;
        text-align: center;
        cursor: pointer;
    }
}

.el-main {
    background-color: #E9EEF3;
}

body > .el-container {
    margin-bottom: 40px;
}

.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}

.el-icon-arrow-down {
    font-size: 12px;
}

.demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
</style>

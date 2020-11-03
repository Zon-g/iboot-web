<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" class="login-form">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"/>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
                        </el-col>
                        <el-col :span="12">
                            <div class="login_button">
                                <el-button type="primary" @click="login('loginForm')">登录</el-button>
                                <el-button @click="cancel('loginForm')">取消</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {login} from "@/api/Login";

export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: 'admin',
                rememberMe: false
            },
            loginRules: {
                username: [
                    {required: true, message: '请输入账号', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.$notify.info({
            title: '消息',
            dangerouslyUseHTMLString: true,
            message: '账号: admin, 密码: admin <br> 请谨慎使用'
        });
    },
    methods: {
        login(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    login(this.loginForm).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: '登录成功',
                                type: 'success'
                            })
                            this.$store.commit("setToken", res.headers.authorization);
                            this.$store.commit("setUser", res.data.data.user);
                            this.$router.push('/main');
                        }
                    }).catch(error => console.log(error));
                } else {
                    console.log("validate fails...");
                }
            })
        },
        cancel(form) {
            this.$refs[form].resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
    height: 100%;
    background-color: aquamarine;
}

.login_box {
    width: 400px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #EEEEEE;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin: -65px auto;
        background-color: #FFFFFF;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #EEEEEE;
        }
    }

    .login-form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;

        .login_button {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>

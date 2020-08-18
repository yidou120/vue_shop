<template>
  <div class="login_container">
      <div class="login_box">
        <div class="avatar_box">
          <img src="../assets/logo.png"/>
        </div>
        <el-form label-width="0px" class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
            <el-button type="info" @click="loginFormReset('loginFormRef')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormReset (formRef) {
      this.$refs[formRef].resetFields()
    },
    login (formRef) {
      this.$refs[formRef].validate((result) => {
        console.log(result)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    background-color: white;
    width: 500px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 3px;
    margin: -150px 0 0 -250px;
  }
  .avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    /*margin: -65px 0 0 -65px;*/
    transform: translate(-50%,-50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
</style>
<style>
  .login_form {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>

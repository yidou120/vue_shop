<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入搜索内容" clearable v-model="paramObj.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="queryUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" class="el-icon-edit" size="mini" @click="editUserForm(scope.row.id)"></el-button>
            <el-button type="danger" class="el-icon-delete" size="mini"></el-button>
            <el-button type="warning" class="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramObj.pagenum"
        :page-sizes="[2, 4, 8, 10]"
        :page-size="paramObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialogEvent"
      >
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialog"
      >
      <el-form :model="editUser" :rules="editUserFormRules" ref="editUserFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[345678]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      paramObj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUser: {},
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.paramObj
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (size) {
      this.paramObj.pagesize = size
      this.getUserList()
    },
    handleCurrentChange (currentPage) {
      this.paramObj.pagenum = currentPage
      this.getUserList()
    },
    queryUsers () {
      this.getUserList()
    },
    async userStateChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        this.paramObj.mg_state = !this.paramObj.mg_state
        return this.$message.error('更新用户状态失败')
      }
      return this.$message.success('更新用户状态成功')
    },
    closeDialogEvent () {
      this.$refs.userFormRef.resetFields()
    },
    addUser () {
      this.$refs.userFormRef.validate(async valid => {
        if (!valid) return this.$message.error('表单校验不通过')
        const { data: res } = await this.$http.post('users', this.userForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async editUserForm (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editUser = res.data
    },
    submitEditUser () {
      this.$refs.editUserFormRef.validate(async valid => {
        if(!valid) return this.$message.error('信息输入不通过')
        const { data: res } = await this.$http.put('users/' + this.editUser.id, {
          email: this.editUser.email,
          mobile: this.editUser.mobile
        })
        if(res.meta.status !== 200) return this.$message.error('修改用户信息失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新成功')
      })
    },
    closeEditDialog () {
      this.$refs.editUserFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>

</style>

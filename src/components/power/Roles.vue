<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1) in scope.row.children"
                     :key="item1.id">
              <el-col :span="5">
                <el-tag closable>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2) in item1.children"
                          :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children"
                            :key="item3.id"
                    >
                      {{item3.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-edit" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-edit">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="35%"
      @close="closeAddDialog"
      >
      <el-form :model="addRoleInfo" :rules="addRoleInfoRules" ref="addRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="35%"
    >
      <el-form :model="editRoleInfo" :rules="editRoleRules" ref="editRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      rolesList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addRoleInfo: {
        roleName: '',
        roleDesc: ''
      },
      editRoleInfo: {},
      addRoleInfoRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    addRole () {
      this.addDialogVisible = true
    },
    closeAddDialog () {
      this.$refs.addRoleRef.resetFields()
    },
    submitRole () {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return this.$message.error('重新填写信息')
        const { data: res } = await this.$http.post('roles', this.addRoleInfo)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.addDialogVisible = false
        this.getRolesList()
        this.$message.success('添加角色成功')
      })
    },
    async editRole (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return
      this.editRoleInfo = res.data
    },
    async submitEditRole () {
      const { data: res } = await this.$http.put('roles/' + this.editRoleInfo.roleId, {
        roleName: this.editRoleInfo.roleName,
        roleDesc: this.editRoleInfo.roleDesc
      })
      if (res.meta.status !== 200) return this.$message.error('修改角色信息失败')
      this.editDialogVisible = false
      this.$message.success('修改角色信息成功')
      this.getRolesList()
    },
    deleteRole (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.success('删除角色失败')
        this.$message.success('删除用户成功')
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .verTag {
    margin-top: 10px;
  }
</style>

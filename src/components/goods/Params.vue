<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="tips">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="paramsCateList"
            :props="cascaderCateProps"
            @change="paramsCateChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isButtonDisable" @click="addParams">添加参数</el-button>
          <el-table :data="manyTableList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.paramInputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showParamInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamValue(scope.row)">修改</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isButtonDisable" @click="addParams">添加属性</el-button>
          <el-table :data="onlyTableList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.paramInputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showParamInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamValue(scope.row)">修改</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加对话框-->
    <el-dialog
      :title="'添加'+getDialogName"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClose">
      <el-form :model="paramInfo" :rules="paramInfoRules" ref="paramInfoRef" label-width="100px">
        <el-form-item :label="getDialogName" prop="attr_name">
          <el-input v-model="paramInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改对话框-->
    <el-dialog
      :title="'修改'+getDialogName"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      >
      <el-form :model="editParamInfo" :rules="editParamInfoRules" ref="editParamInfoRef" label-width="100px">
        <el-form-item :label="getDialogName" prop="attr_name">
          <el-input v-model="editParamInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      paramInfo: {
        attr_name: ''
      },
      editParamInfo: {},
      editParamsDialogVisible: false,
      addParamsDialogVisible: false,
      manyTableList: [],
      onlyTableList: [],
      activeName: 'many',
      paramsCateList: [],
      selectKeys: [],
      cascaderCateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      paramInfoRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editParamInfoRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getParamCateList()
  },
  computed: {
    isButtonDisable () {
      if (this.selectKeys.length === 3) {
        return false
      }
      return true
    },
    getDialogName () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    getCateId () {
      if (this.selectKeys.length === 3) {
        const cateId = this.selectKeys[this.selectKeys.length - 1]
        return parseInt(cateId)
      }
      return null
    },
    paramsCateChange () {
      this.getPramsList()
    },
    async getParamCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.paramsCateList = res.data
    },
    tabClick () {
      this.getPramsList()
    },
    async getPramsList () {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.onlyTableList = []
        this.manyTableList = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.getCateId()}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.paramInputValue = ''
      })
      if (this.activeName === 'only') {
        this.onlyTableList = res.data
      }
      this.manyTableList = res.data
      console.log(res.data)
    },
    showParamInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (row) {
      if (row.paramInputValue.trim().length === 0) {
        row.paramInputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.paramInputValue.trim())
      row.paramInputValue = ''
      row.inputVisible = false
      this.saveAtrrVal(row)
    },
    async saveAtrrVal (row) {
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    addParamsDialogClose () {
      this.$refs.paramInfoRef.resetFields()
    },
    addParams () {
      this.addParamsDialogVisible = true
    },
    submitParams () {
      this.$refs.paramInfoRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.getCateId()}/attributes`, {
          attr_name: this.paramInfo.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getPramsList()
        this.addParamsDialogVisible = false
      })
    },
    async editParamValue (row) {
      const { data: res } = await this.$http.get(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      this.editParamInfo = res.data
      this.editParamsDialogVisible = true
    },
    submitEditParam () {
      this.$refs.editParamInfoRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.getCateId()}/attributes/${this.editParamInfo.attr_id}`, {
          attr_name: this.editParamInfo.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.$message.success('修改成功')
        this.getPramsList()
        this.editParamsDialogVisible = false
      })
    },
    deleteParams (row) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.getCateId()}/attributes/${row.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getPramsList()
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
  .tips {
    margin: 15px 0px;
  }
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 150px;
  }
</style>

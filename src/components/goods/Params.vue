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
          <el-button type="primary" size="mini" :disabled="isButtonDisable">添加参数</el-button>
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
              <template>
                <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isButtonDisable">添加属性</el-button>
          <el-table :data="onlyTableList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
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
    async handleInputConfirm (row) {
      row.inputVisible = false
      if (row.paramInputValue.trim().length === 0) {
        row.paramInputValue = ''
        return
      }
      row.attr_vals.push(row.paramInputValue.trim())
      row.paramInputValue = ''
      const { data: res } = this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
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

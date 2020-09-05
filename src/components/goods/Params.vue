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
        <el-tab-pane label="动态参数" name="first">动态参数</el-tab-pane>
        <el-tab-pane label="静态属性" name="second">静态属性</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      activeName: 'first',
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
  methods: {
    paramsCateChange () {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
      }
    },
    async getParamCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.paramsCateList = res.data
    },
    tabClick () {}
  }
}
</script>

<style scoped lang="less">
.tips {
  margin: 15px 0px;
}
</style>

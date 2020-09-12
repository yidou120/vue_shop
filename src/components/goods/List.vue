<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchContent">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="goodsList"
        border
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="700px">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="150px">
        </el-table-column>
        <el-table-column
          label="操作">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      searchContent: '',
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getGoodsList()
    },
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getGoodsList()
    },
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('商品列表加载失败')
      }
      res.data.goods.forEach(i => {
        const date = new Date(i.add_time)
        const Y = date.getFullYear() + '-'
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        const D = date.getDate() + ' '
        const h = date.getHours() + ':'
        const m = date.getMinutes() + ':'
        const s = date.getSeconds()
        i.add_time = Y + M + D + h + m + s
      })
      this.goodsList = res.data.goods
      this.queryInfo.pagenum = res.data.pagenum
      this.total = res.data.total
    }
  }
}
</script>

<style scoped lang="less">

</style>

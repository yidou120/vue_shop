<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="orderInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        stripe
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="order_pay"
          label="是否付款"
          width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==='0'" type="danger">未付款</el-tag>
            <el-tag v-else="" type="danger">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          width="200px">
          <template slot-scope="scope">
            {{scope.row.create_time | timeformat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" class="el-icon-edit" @click="editOrderInfo"></el-button>
            <el-button size="mini" type="success" class="el-icon-location" @click="showLocation(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="查看物流进度"
      :visible.sync="locationDialogVisible"
      width="50%">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <el-dialog
      title="修改地址"
      :visible.sync="editLocationDialogVisible"
      width="50%"
      @close="closeEditLocation">
      <el-form :model="locationInfo" :rules="locationInfoRules" ref="locationInfoRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="locationInfo.address1" :options="options" :props="{ expandTrigger: 'hover' }" @change="expandChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="locationInfo.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editLocationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editLocationDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import options from './citydata'
export default {
  name: '',
  data () {
    return {
      locationInfo: {
        address1: [],
        address2: ''
      },
      activities: [],
      reverse: false,
      editLocationDialogVisible: false,
      locationDialogVisible: false,
      orderList: [],
      orderInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      locationInfoRules: {
        address1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      options
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      console.log(this.orderInfo.query)
      const { data: res } = await this.$http.get('orders', {
        params: this.orderInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      console.log(res)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (pagesize) {
      this.orderInfo.pagesize = pagesize
      this.getOrderList()
    },
    handleCurrentChange (pagenum) {
      this.orderInfo.pagenum = pagenum
      this.getOrderList()
    },
    async showLocation (row) {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.activities = res.data
      this.locationDialogVisible = true
      console.log(res)
      console.log(row)
    },
    editOrderInfo () {
      this.editLocationDialogVisible = true
    },
    closeEditLocation () {
      this.$refs.locationInfoRef.resetFields()
    },
    expandChange () {
      console.log(this.locationInfo.address1)
    }
  }
}
</script>

<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>

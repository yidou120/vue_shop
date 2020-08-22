<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/heima.png"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container class="home-container">
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="white">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
              <el-menu-item index="1-1">
                <i class="el-icon-location"></i>
                {{subItem.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>main</el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  created () {
    this.getMenuList()
  },
  name: '',
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: result } = await this.$http.get('/menus')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.menuList = result.data
      console.log(result)
    }
  }
}

</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>

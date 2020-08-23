<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/heima.png" style="width: 50px;height: 50px;"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container class="home-container">
      <el-aside :width="collapseValue ? '64px' : '200px'">
        <div class="toggle_bar" @click="toggleButton">
          |||
        </div>
        <el-menu background-color="#333744" text-color="white" active-text-color="#409BFF"
                 :unique-opened="true" :collapse="collapseValue" :collapse-transition="false"
                 router :default-active="$route.path"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <i class="el-icon-menu"></i>
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
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
      menuList: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-3702mima',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      collapseValue: false
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
    },
    toggleButton () {
      this.collapseValue = !this.collapseValue
    }
  }
}

</script>

<style lang="less" scoped>
.toggle_bar {
  background-color: #4a5064;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.1em;
  color: white;
  line-height: 25px;
  font-size: 12px;
}
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
  .iconfont {
    margin-right: 10px;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>

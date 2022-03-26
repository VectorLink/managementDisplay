<template>

  <el-container style="height: 150px; border: 1px solid #eee">
    <el-header style="text-align: center; font-size: 12px">
        <div class="header">
          <el-header>
            <img class="logo" src="@/assets/log.png" alt="">
          </el-header>
          <div class="userImg">
            <el-avatar :size="80" :src="user.userlog" ></el-avatar>
            <span>{{user.username}}</span>
            <el-link type="primary" @click="logout">退出</el-link>
          </div>
        </div>
    </el-header>
    <el-aside>
      <el-row class="tac">
        <el-col :span="12">
          <el-menu
              :default-active="this.$router.path" router
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
            <el-menu-item index="/vipUser" route>
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>会员管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/hairMaster" >
              <i class="el-icon-menu"></i>
              <span slot="title">员工管理</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
  </el-container>
</template>

<script>
import userLog from '@/assets/user.png'
export default {
  name: 'Menu',
  data(){
    return{
      user:{
        username:this.$store.state.userInfo.hairMasterName,
        userlog:userLog
      }
    }
  },
  methods:{
    logout(){
      const _this=this;
      _this.$axios.get("logout").then(res=>{
        _this.$store.commit("REMOVE_INFO")
        _this.$router.push("/login")
      })
    }
  }
}
</script>


<style scoped>
.userImg{
  float:right;
  width:200px;
}
.logo{
  height: 100%;
  margin-top: 20px;
}
.el-aside{
  width: 200px;
  padding: 100px 0;
}
</style>

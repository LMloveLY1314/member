<template>
  <div class="header">
    <el-row :gutter="10">
      <!--Logo area-->
      <el-col :xs="10" :sm="10" :md="{span:19,offset:1}">
        <div class="logo">
          <span class="logo_prefix">四火</span>
          <span class="logo_suffix">会员管理系统</span>
        </div>
      </el-col>
      <el-col style="  cursor: pointer" :xs="2" :sm="2" :md="1">
        <span style="color: #545C64;">1</span>
      </el-col>
      <div style="float: right;margin-right: 5px">
        <div class="user-header">
          <span style="margin-right: 5px;font-size: 16px;color: blue">欢迎您，{{userInfo.userName}}</span>
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <img class="user-avatar" :src="userInfo.face">
              <!-- :src="avatar+'?imageView2/1/w/80/h/80'">
 -->
              <i class="el-icon-caret-bottom"></i>
            </div>
<!--            头部菜单下拉框-->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="setting-div">
                  <router-link to="/">
                    <span class="setting-icon">
                    <i class="icon iconfont icon-yonghu"></i>
                  </span>
                    <span class="setting-string"> 首页</span>
                  </router-link>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <div class="setting-div" @click="openEditDialog()">
                  <span class="setting-icon"><i class="icon iconfont icon-shezhi"></i></span>
                  <span class="setting-string"> 设置</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <div class="setting-div" @click="logout">
                  <span class="setting-icon"><i class="icon iconfont icon-084tuichu"></i></span>
                  <span class="setting-string"> 退出</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-row>
    <!--          修改个人信息窗体-->
    <el-dialog
      title="个人信息"
      :visible.sync="dialogVisible"
      width="500px"
      @open="handleClose"
    >
      <el-form :model="userEditForm"  ref="userEditForm" label-width="120px">
        <el-form-item label="管理员名称" prop="userName">
          <span v-if="userEditForm.id">{{ userEditForm.userName }}</span>
          <el-input v-else v-model="userEditForm.userName" :maxlength="20" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input type="password" v-model="userEditForm.password" :maxlength="20" clearable :placeholder="userEditForm.id ? '不修改请留空' : '6-20位数字、英文字母'"></el-input>
        </el-form-item>
        <el-form-item label="管理员真实姓名" prop="realName">
          <el-input v-model="userEditForm.realName" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="管理员头像" prop="face">
          <el-upload
            :action="uploadApi"
            :on-success="(res) => { userEditForm.face = res.data.url }"
            :on-remove="() => { userEditForm.face = '' }"
            :file-list="userEditForm.face"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      uploadApi:'http://localhost:8082/uploaders',
      name: 'linxin',
      dialogVisible:false,//个人信息窗体
      userInfo:{},//登录用户信息
      userEditForm:{
        id:'',
        userName:'',//用户名
        face:'',//头像
        password:'',//密码
        realName:'',//真实姓名
      },//编辑登录用户信息表单
    }
  },
  mounted() {
    //将登录时存入sessionStorage的用户信息取出，并转成json格式
    this.userInfo=eval('(' + sessionStorage.getItem("user") + ')')
  },
  methods: {
    //打开编辑信息窗体
    openEditDialog(){
      this.userEditForm.face=this.userInfo.face
      this.userEditForm.realName=this.userInfo.realName
      this.userEditForm.userName=this.userInfo.userName
      this.userEditForm.id=this.userInfo.id
      this.dialogVisible=true
    },
    //关闭个人信息窗体，清空表单内容
    handleClose(){
    },
    handleCommand(command) {
      console.log(command);
      this.$message('click on item ' + command);
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
}

</script>
<style lang="scss" scoped>
.header {
  //logo标题
  .logo {
    float: left;
    cursor: pointer;
    font-size: 22px;
    .logo_prefix {
      color: #ffce40;
    }
    .logo_suffix {
      color: #fff;
    }
  } //中间下拉框
  .header-right {
    span {
      display: inline-block;
      margin-left: 14px;
      font-size: 18px;
      color: #fff;
      line-height: 1px;
      height: 18px;
      cursor: pointer;
    }
    span:hover {
      color: #209e91;
    }
  }
  .user-header {
    line-height: 10px;
    padding-top: 7px;
    font-size: 12px;
    img {
      cursor: pointer;
    }
  }
}

.task-div {
  clear: both;
  height: 55px;
  .task-span {
    display: block;
    float: left;
    font-size: 12px
  }
  .task-content {
    width: 160px;
    line-height: 16px;
    margin-left: 10px;
    padding: 5px;
    .task-time {
      clear: both;
      float: right;
      color: #ccc;
    }
  }
}

//用户设置
.setting-div {
  height: 30px;
  line-height: 30px;
  clear: both;
  span {
    display: block;
    float: left;
    font-size: 12px;
  }
  .setting-icon {
    padding-top: 0px;
    padding-right: 5px;
  }
}

//小标题
.pop-title {
  font-size: 12px;
  color: #209e91;
}

//头像
.avatar-wrapper {
  cursor: pointer;
  margin-top: 5px;
  position: relative;
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  i {
    position: absolute;
    padding: 29px 5px 5px 44px;
    left: -0;
    top: 0;
    font-size: 12px;
    color: #ffffff;
  }
  i:hover {
    color: #64D9D6;
  }
}

//国际化
.international {
  cursor: pointer;
}



</style>

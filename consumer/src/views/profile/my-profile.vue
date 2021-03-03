<template>
  <div id="my-profile">
    <van-nav-bar
            left-arrow="left-arrow"
            @click-left="toProfile"
            title="我的资料">
    </van-nav-bar>
<!--    点击事件应该用@来绑定，而不是官方文档说的:绑定-->
    <div class="profile-container">
      <van-cell-group :border="false">
        <van-cell title="头像" is-link class="face-cell">
          <en-face :url="profileForm.face" class="img-face"/>
          <input id="update-face" class="update-face" type="file" accept="image/jpg,image/jpeg,image/png" @change="handleUpdateFace">
        </van-cell>
        <van-cell title="用户名" :value="profileForm.user_name"/>
        <van-cell title="昵称" :value="profileForm.nickname" is-link @click="showEditNickname = true"/>
        <van-cell title="性别" :value="profileForm.sex === 1 ? '男' : '女'" is-link @click="showSexActionsheet = true"/>
        <van-cell title="生日" :value="formatterBirthdayDate()" is-link @click="showBirthdayActionsheet = true"/>
      </van-cell-group>
    </div>
    <!--修改昵称弹框-->
    <van-dialog
            v-model="showEditNickname"
            title="请输入昵称"
            show-cancel-button
            :before-close="beforeNicknameClose"
            @confirm="profileForm.nickname = nickname"
    >
      <van-field v-model="nickname" clearable placeholder="2-20位汉字、字母或数字"/>
    </van-dialog>
    <!--修改性别弹出菜单-->
    <van-action-sheet v-model="showSexActionsheet" :actions="sexActions" cancel-text="取消"/>
    <van-action-sheet v-model="showBirthdayActionsheet">
<!--   -->
      <van-datetime-picker
              v-model="currentDate"
              type="date"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="confirmBirthday()"
      />
    </van-action-sheet>
    <!--登录-->
    <div class="big-btn">
      <van-button size="large" @click="submitProfile">保存修改</van-button>
    </div>
  </div>
</template>

<script>
  import EnFace from '../../components/Face'
  import {Foundation,RegExp } from '../../ui-utils/index'
  import '../../assets/scripts/dateFormat'
  import  * as  API_Consumer from '../../api/consumer'

  export default {
    name: 'my-profile',
    components:{
      EnFace
    },
    //挂载组件时，查询出当前的用户
    mounted() {
        console.log( this.$store.state.user.user)
    },
    data() {
      //登录时保存的用户信息
      const user = this.$store.state.user.user
      return {
        uploadApi:'http://localhost:7003/uploaders',
        minDate: new Date(1900, 0, 1),
        maxDate: new Date(),
        currentDate: new Date(),
        /** 个人资料 表单 */
        profileForm: user ? JSON.parse(JSON.stringify(user)) : {},
        // 显示修改昵称 dialog
        showEditNickname: false,
        // 昵称
        nickname: user.nickname || '',
        // 显示性别选择菜单
        showSexActionsheet: false,
        // 性别选择菜单选项
        sexActions: [
          { name: '男', callback: (action) => {
            this.profileForm.sex = 1
            this.showSexActionsheet = false
          }},
          { name: '女', callback: () => {
            this.profileForm.sex = 0
            this.showSexActionsheet = false
          }}
        ],
        // 显示日期选择器
        showBirthdayActionsheet: false,
        // 生日   date对象
        birthday: user.birthday ? new Date(user.birthday * 1000) : new Date(),
        // 图片裁剪源
        cropper_img: '',
        // 显示图片裁剪
        show_cropper: false
      }
    },
    methods: {
      //跳转Profile
      toProfile(){
        this.$router.go(-1)
      },
      /** 头像发生改变 */
      handleUpdateFace(event) {
        const {files} = event.target
        if (files.length === 0) return
        const file = files[0]
          this.handleUpload(file, file.name)
          event.target.value = ''
      },
      /** base64转Blob */
      MixinBase64toBlob(base64) {
        const byteString = atob(base64.split(',')[1])
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], {type: mimeString})
      },
      // 上传文件
      handleUpload(file, filename = 'file') {
        const formData = new FormData()
        if (typeof file === 'string') {
          file = this.MixinBase64toBlob(file)
        }
        formData.append('file', file, filename)
        this.$http({
          url: '/uploaders',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          console.log(response)
          this.profileForm.face = response.data.url
        })
      },
      /** 确认生日选择 */
      confirmBirthday(val) {
        this.profileForm.birthday =val
        this.showBirthdayActionsheet = false
      },
      /** 格式化生日日期 */
      formatterBirthdayDate() {
        const { birthday } = this.profileForm
        return Foundation.unixToDate(birthday, 'yyyy-MM-dd')
      },
      /** 昵称dialog关闭前 */
      beforeNicknameClose(action, done) {
        if (action === 'cancel') return done()
        const { nickname } = this
        if (!nickname) {
          this.$message.error('请输入昵称！')
          done(false)
        } else if (nickname.length < 2 || nickname.length > 20) {
          this.$message.error('长度应在2-20之间！')
          done(false)
        } else if (!RegExp.userName.test(nickname)) {
          this.$message.error('格式不正确！')
          done(false)
        } else {
          done()
        }
      },
      /** 保存资料提交表单 */
      submitProfile() {
        const { birthday } = this.profileForm
        if (isNaN(birthday) ) {
          this.$message.error('生日格式不正确！')
          return
        }
        API_Consumer.editConsumer(this.profileForm).then(() => {
          //更新成功后获取用户数据，重新设置客户端的用户信息
          this.$store.dispatch('getUserDataAction')
          this.$message.success('修改成功！')
        })
      },
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  /deep/ {
    .van-cell {
      align-items: center;
    }
  }
  .profile-container {
    padding-top: 46px;
  }
  .face-cell {
    padding-top: 5px;
    padding-bottom: 5px;
    .img-face {
      width: 50px;
      height: 50px;
    }
    .update-face {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
    }
  }
  .birthday-input {
    background-color: #fff;
    width: 100%;
    text-align: right;
    &::-webkit-calendar-picker-indicator {
      display: none;
    }
    &::-webkit-clear-button {
      display: none;
    }
  }
  .cropper-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #836FFF;
  }
  /deep/ .confirm-btns {
    position: absolute;
    left: 50%;
    margin-left: -(186px / 2);
    bottom: 20px;
    .van-button:first-child {
      margin-right: 10px;
    }
  }
</style>

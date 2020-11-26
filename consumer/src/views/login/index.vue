<template>
        <div>
            <div style="height: 250px;width: 414px">
               <img src="../../assets/img/cosumer-login.jpg" style="width: 100%;height: 250px">
            </div>
<!--登录卡片-->
            <el-card class="box-card" v-if="show==1">
                <div slot="header" >
                    <span>登录</span>
                </div>
                <div class="form">
                    <el-form ref="loginFromRef" :model="loginForm"  :rules="rules" >
                        <el-form-item class="form-item" prop="username"
                        >
                            <el-input
                                    prefix-icon="el-icon-mobile-phone"
                                    placeholder="请输入用户名或手机号"
                                    v-model="loginForm.username"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password"
                        >
                            <el-input
                                    prefix-icon="el-icon-lock"
                                    placeholder="请输入密码"
                                    show-password
                                    v-model="loginForm.password"
                            ></el-input>
                        </el-form-item>
                        <el-form-item class="form-item" prop="vcode"
                        >

                            <el-input
                                    placeholder="请输入验证码"
                                    v-model="loginForm.vcode"
                                    style="width: 50%"
                            ></el-input>
                            <img :src="validcodeImg" @click="changeValidcodeClick" id="code-img">
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-link type="success" :underline="false" style="float: left" @click="changeShow(2)">立即注册</el-link>
                        <el-link type="success"  :underline="false" style="float: right" @click="changeShow(3)">忘记密码？</el-link>
                    </div>
                    <el-button style="margin-top: 30px;width:80%;margin-left: 10% "
                               type="success" round
                               @click="login"
                    >登录</el-button>
                </div>


            </el-card>
<!--注册卡片-->
            <el-card class="box-card" v-if="show==2">
                <div slot="header" >
                    <span>注册</span>
                </div>
                <div class="form">
                    <el-form :model="registerForm" >
                        <el-form-item class="form-item"
                        >
                            <el-input
                                    prefix-icon="el-icon-mobile-phone"
                                    placeholder="请输入11未手机号码"
                                    v-model="registerForm.username"
                            ></el-input>
                        </el-form-item>
                        <el-form-item class="form-item"
                        >
                            <el-input
                                    prefix-icon="el-icon-mobile-phone"
                                    placeholder="请输入验证码"
                                    v-model="registerForm.vcode"
                                    style="width: 60%"
                            ></el-input>
                            <el-button
                                    style="float: right"
                                    type="success" round
                            >获取验证码</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top: 50px">
                        <el-button
                                type="primary" round
                                @click="changeShow(1)"
                        >返回登录</el-button>
                        <el-button
                                style="float: right"
                                type="success" round
                                @click="validateSms"
                        >下一步</el-button>
                    </div>
                </div>


            </el-card>
<!--忘记密码卡片-->
            <el-card class="box-card" v-if="show==3">
            <div slot="header" >
                <span>忘记密码</span>
            </div>
            <div class="form">
                <el-form :model="pwdForm" >
                    <el-form-item class="form-item"
                    >
                        <el-input
                                prefix-icon="el-icon-mobile-phone"
                                placeholder="请输入11未手机号码"
                                v-model="pwdForm.username"
                        ></el-input>
                    </el-form-item>
                    <el-form-item class="form-item"
                    >
                        <el-input
                                prefix-icon="el-icon-mobile-phone"
                                placeholder="请输入验证码"
                                v-model="pwdForm.vcode"
                                style="width: 60%"
                        ></el-input>
                        <el-button
                                style="float: right"
                                type="success" round
                        >获取验证码</el-button>
                    </el-form-item>
                    <el-form-item
                    >
                        <el-input
                                prefix-icon="el-icon-lock"
                                show-password
                                placeholder="请设置8-16位的新密码"
                                v-model="pwdForm.password"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div style="margin-top: 50px">
                    <el-button
                            type="primary" round
                            @click="changeShow(1)"
                    >返回登录</el-button>
                    <el-button
                            style="float: right"
                            type="success" round>完成</el-button>
                </div>
            </div>

        </el-card>

<!--注册第二步，填写用户名，密码等            -->
            <el-card class="box-card" v-if="show==4">
                <div slot="header" >
                    <span>用户信息</span>
                </div>
                <div class="form">
                    <el-form :model="registerForm2" >
                        <el-form-item class="form-item"
                        >
                            <el-input
                                    prefix-icon="el-icon-mobile-phone"
                                    placeholder="请输入用户名"
                                    v-model="registerForm2.username"
                            ></el-input>
                        </el-form-item>
                        <el-form-item class="form-item"
                        >
                            <el-input
                                    prefix-icon="el-icon-lock"
                                    placeholder="请设置8-16位的新密码"
                                    v-model="registerForm2.pwd_one"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                        >
                            <el-input
                                    prefix-icon="el-icon-lock"
                                    show-password
                                    placeholder="请再次输入密码"
                                    v-model="registerForm2.pwd_two"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top: 50px">
                        <el-button
                                type="primary" round
                                @click="changeShow(1)"
                        >取消注册</el-button>
                        <el-button
                                style="float: right"
                                type="success" round
                                @click="register"
                        >完成</el-button>
                    </div>
                </div>

            </el-card>
            <!--            放三个卡片：登录、注册、忘记密码
                             用一个变量来定义状态，表示选中哪个界面
                             -->
<!--            设置密码弹窗-->
        </div>
</template>

<script>
    import uuidv1 from "uuid/v1";
    import Storage from "../../util/storage";
    import  * as API_Register from '../../api/register'
    const qs = require('qs');
    export default {
        name: "index",
        data(){
            return{
                loginForm:{
                    username:"",
                    password:"",
                    vcode:'',
                    uuid:'',

                },
                rules: {
                    id: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    vcode:[
                        { required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                /** 图片验证码*/
                validcodeImg: "",
                uuid: Storage.getItem("consumer_uuid"),
                show:1,
                registerForm:{
                    phone:"",
                    vcode:''
                },
                /** 忘记密码表单  */
                pwdForm:{
                    phone:"",
                    vcode:'',
                    password:''
                },
                /** 注册第二步*/
                registerForm2:{

                }
            }
        },
        methods:{
            /** 改变显示的卡片*/
            changeShow(show){
                this.show=show
            },
            login(){
                //表单的引用对象,valid:成功或失败
                this.$refs.loginFromRef.validate(async valid=> {
                    if (!valid) return
                    //解析表单数据，添加uuid
                    const params = JSON.parse(JSON.stringify(this.loginForm))
                    params.uuid = this.uuid
                    this.loginForm.uuid = this.uuid;
                    this.$store
                        .dispatch("loginAction", params)
                        .then(() => {
                            //登录成功
                            // const forward = this.$route.query.forward;
                            // //如果之前没有登录，默认去往首页，否则去往之前的页面
                            // this.$router.push({ path: forward || "/" });
                            this.$router.push("/home")
                        })
                        .catch(err => {
                            alert(err)
                            this.changeValidcodeClick();
                        });
                })
            },
            changeValidcodeClick(){
                this.validcodeImg='http://localhost:7003/getGifCode/'+this.uuid+'?sence='+new Date().getTime()
            },
            /** 校验短信是否正确*/
            validateSms(){
                this.show=4
            },
            /** 注册*/
            register(){
                this.$refs.loginFromRef.validate(async valid=>{
                    if(!valid) return
                    //解析表单数据，添加uuid
                    const  params=JSON.parse(JSON.stringify(this.registerForm2))
                    API_Register.register(this.registerForm2).then(() => {

                        })
                        .catch(err  => {
                            alert(err)
                        });

                })

            },
        },
        mounted() {
            //不存在UUID则创建一个，并存入admin_uuid，设置过期时间为30天
            const uuid = Storage.getItem("consumer_uuid");
            if (uuid) {
                this.uuid = uuid;
            } else {
                const _uuid = uuidv1();
                this.uuid = _uuid;
                Storage.setItem("consumer_uuid", _uuid, { expires: 30 });
            }
            //获取图片验证码
            this.changeValidcodeClick()
        }
    }
</script>

<style scoped>
.box-card{
    left: 15px;
    right: 15px;
    position: absolute;
    top: 230px;
}
    .form{
        margin-left: 10px;
        margin-right: 10px;
    }
    #code-img{
        margin-left: 10px;
        height: 40px;
        width: 40%;
        float: right;
    }
</style>

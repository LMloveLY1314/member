<template>
    <div>
        <van-nav-bar
                left-arrow="left-arrow"
                @click-left="toHome"
                title="发布悬赏">
        </van-nav-bar>
        <van-steps :active="active">
            <van-step>选择分类</van-step>
            <van-step>商品描述</van-step>
            <van-step>雇主信息</van-step>
        </van-steps>
<!--        展示用户选择的内容-->
<!--        分作不同的卡片来填写不同的内容-->
<!--        使用el-card来显示不同卡片，使用弹出菜单的形式来选择-->
        <div>
<!--            选择分类-->
            <el-card class="box-card" v-if="show==1">
                <van-cell-group :border="false">
                    <van-cell title="选择分类" :value="orderForm.category_name" is-link @click="showCategory= true"/>
                    <van-cell title="服务类型" :value="orderForm.type_name" is-link @click="showType = true"/>
                    <van-cell title="服务时间" :value="time_String" is-link @click="showTime = true"/>
                </van-cell-group>
<!--                分类弹出层-->
                <van-popup
                        v-model ="showCategory"
                        position="bottom"
                        custom-style="height: 50%;"
                >
                    <van-picker
                            show-toolbar
                            title="选择分类"
                            :columns="categoryColumns"
                            @confirm="confirmCategory"
                            @cancel="showCategory=false"
                    />
                </van-popup>
<!--                服务类型弹出层-->
                <van-popup
                        v-model ="showType"
                        position="bottom"
                        custom-style="height: 50%;"
                >
                    <van-picker
                            v-model="orderForm.type_name"
                            show-toolbar
                            title="服务类型"
                            :columns="typeColumns"
                            @confirm="confirmType"
                            @cancel="showType=false"
                    />
                </van-popup>
<!--                服务时间弹出层-->
                <van-action-sheet v-model="showTime">
                    <!--   -->
                    <van-datetime-picker
                            v-model="currentDate"
                            type="datetime"
                            :min-date="minDate"
                            @confirm="confirmTime"
                            @cancel="showTime=false"
                    />
                </van-action-sheet>
                <div style="position: absolute;bottom: 0px;left: 0px;width: 100%">
                    <van-button
                            icon="star-o"
                            type="primary"
                            @click="next"
                            style="float: right"
                    >下一步</van-button>
                </div>

            </el-card>
<!--            商品图片-->
            <el-card class="box-card" v-if="show==2">
               <div>
                   <van-button
                           icon="star-o"
                           type="primary"
                           @click="showGoodsInfo=true"
                   >填写商品信息</van-button>
                   <h4 style="margin-bottom: 20px">请上传服务商品图片</h4>
               </div>
                <el-upload
                        :action="uploadApi"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-success="uploadeSuccess"
                        :on-remove="handleRemove"
                        v-bind:file-list="fileList"
                        show-file-list="false"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <div style="position: absolute;bottom: 0px;left: 0px;width: 100%">
                    <van-button icon="star-o" type="primary" @click="back" >返回</van-button>
                    <van-button
                            icon="star-o"
                            type="primary"
                            @click="next"
                            style="float: right"
                    >下一步</van-button>
                </div>
<!--                商品信息弹出层-->
                <van-popup
                        v-model="showGoodsInfo"
                        closeable="true"
                        position="bottom"
                        custom-style="height: 50%;"
                >
                    <div>
                        维修信息
                        <van-cell-group>
                            <van-field
                                    v-model="orderForm.goods_brand"
                                    left-icon=""
                                    :required="true"
                                    label="商品品牌"
                            />
                            <van-field
                                    v-model="orderForm.goods_name"
                                    :required="true"
                                    label="商品名称"
                            />
                            <van-field
                                    v-model="orderForm.fault_type"
                                    :required="true"
                                    label="故障类型"
                            />
                            <van-field
                                    v-model="orderForm.fault_info"
                                    :required="true"
                                    type="textarea"
                                    fixed="fixed"
                                    border="border"
                                    label="故障描述"
                            />
                        </van-cell-group>
                    </div>
                </van-popup>
            </el-card>
<!--            雇主信息-->
            <el-card class="box-card" v-if="show==3">
                <van-cell-group>
                    <van-field
                            v-model="orderForm.comsumer_name"
                            left-icon=""
                            :required="true"
                            label="姓名："
                            placeholder="请填写联系人姓名"
                    />
                    <van-field
                            v-model="orderForm.consumer_mobile"
                            :required="true"
                            label="电话："
                            placeholder="请输入手机号"
                    />
                    <van-field
                            v-model="orderForm.consumer_addr"
                            label="所在地区"
                            :required="true"
                            :readonly="true"
                            placeholder="请选择所在地区"
                            @click.native="showAddressSelector = true"
                    />
                    <van-field
                            v-model="orderForm.detail_addr"
                            :required="true"
                            type="textarea"
                            fixed="fixed"
                            border="border"
                            label="详细地址"
                            placeholder="请填写详细地址"

                    />
                </van-cell-group>
                <div style="position: absolute;bottom: 0px;left: 0px;width: 100%">
                    <van-button icon="star-o" type="primary" @click="back" >返回</van-button>
                    <van-button
                            icon="star-o"
                            type="primary"
                            style="float: right"
                            @click="newOrder"
                    >发布</van-button>
                </div>
                <en-region-picker
                        :show="showAddressSelector"
                        :api="MixinRegionApi"
                        @closed="showAddressSelector = false"
                        @changed="handleAddressSelectorChanged"
                />
            </el-card>

        </div>

    </div>
</template>

<script>
    import Vue from 'vue';
    import * as OrderBase_API from '../api/order-base'
    import * as Order_API from '../api/order'
    import '../assets/scripts/dateFormat'
    import { Step, Steps,Grid,GridItem,Image,Tab,Tabs,Picker } from 'vant';
    Vue.use(Step);
    Vue.use(Steps);
    Vue.use(Grid)
    Vue.use(GridItem)
    Vue.use(Image)
    Vue.use(Tabs)
    Vue.use(Tab)
    Vue.use(Picker)
    export default {
        name: "release",
        data() {
            return{
                MixinRegionApi:`http://localhost:7003/regions/@id/children`,
                uploadApi:'http://localhost:7003/uploaders',
                showAddressSelector:false,
                dialogImageUrl: '',
                dialogVisible: false,
                showGoodsInfo:false,
                active: 0,
                show:1,
            //    发布悬赏form
                orderForm:{
                    category_name:'',
                    type_name:'',
                    order_images:'',
                    comsumer_name:'',
                    consumer_mobile:'',
                    consumer_addr:'',
                    detail_addr:'',
                    region:'',   //最底层的地区的id，根据这个id可以确定唯一的地区
                },
                showCategory:false,
                showType:false,
                showTime:false,
                categoryColumns: [],
                typeColumns:[],
                minDate: new Date(),
                currentDate: new Date(),
                fileList: [],
                time_String:'',//预约时间标准化格式
            }


        },
        /** 获取分类列表和服务类型列表*/
        mounted() {
            this.getCategoryList()
            this.gettypeList()
        },
        methods:{
            /** 地址选择器发生改变
             * 设置最底层地区id和地址
             * */
            handleAddressSelectorChanged(object) {
                console.log(object)
                this.orderForm.consumer_addr=object.string
                this.orderForm.region=object.last_id   //最底层地区id
                this.orderForm.consumer_city_id=object.city.id  //城市id
                this.orderForm.consumer_province_id=object.province.id  //省份id
                this.orderForm.consumer_county_id=object.region.id    //城镇id
                if(object.town.id){
                    this.orderForm.consumer_town_id=object.town.id
                }
            },
            toHome(){
                this.$router.replace('/home')
            },
            back(){
                this.show-=1
                this.active-=1
            },
            next(){
                this.show+=1
                this.active+=1
            },
            /**移除图片*/
            handleRemove(file) {
                //官网说有索引，但是没找到索引，根据图片名称来删吧:删除文件列表中文件名为file.name的文件
                console.log(file)
                for(let j = 0,len=this.fileList.length; j < len; j++) {
                    if(file.name===this.fileList[j].name){
                    //    从服务器将文件删除，再将其从文件列表里删除
                        //删除文件接口，暂时不写也可以
                        this.fileList.splice(j,1)
                        return
                    }
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            /** 上传图片成功之后*/
            uploadeSuccess(response){
                //将路径设置到fileList
                this.fileList.push({"name":response.name,"url":response.url})
            },
            goodsInfo(){
                alert("单击图片")
            },
            getCategoryList(){
                OrderBase_API.catregoryList().then(res=>{
                    /**   因为上拉列表需要传递数组，但我得到的是一个对象，要么遍历之后存到分类数据
                     *
                     */
                    for(let j = 0,len=res.length; j < len; j++) {
                        this.categoryColumns.push(res[j].category_name)
                    }
                })
            },
            gettypeList(){
                OrderBase_API.typeList().then(res=>{
                    for(let j = 0,len=res.length; j < len; j++) {
                        this.typeColumns.push(res[j].type_name)
                    }
                })
            },
            /***确定分类*/
            confirmCategory(event){
                 this.orderForm.category_name=event
                 this.showCategory=false
            },
            /***确定服务类型*/
            confirmType(event){
                this.orderForm.type_name=event
                this.showType=false

            },
            /***确定服务时间*/
            confirmTime(event){
                const time=parseInt(event.getTime()/1000)
                this.orderForm.arrange=time
                this.time_String=this.dateFormat("YYYY-mm-dd HH:MM", event)
                this.showTime=false
            },
            /**时间格式化*/
            dateFormat(fmt, date) {
                let ret;
                const opt = {
                    "Y+": date.getFullYear().toString(),        // 年
                    "m+": (date.getMonth() + 1).toString(),     // 月
                    "d+": date.getDate().toString(),            // 日
                    "H+": date.getHours().toString(),           // 时
                    "M+": date.getMinutes().toString(),         // 分
                    "S+": date.getSeconds().toString()          // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                };
                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                    };
                };
                return fmt;
            },
            /**发布悬赏，需要设置当前用户的id(consumer_id)
             * 不在前端获取，验证时从后端取出当前用户
             * */
            newOrder(){
                const  orderForm=this.orderForm
                //拼接图片路径字符串
                for(let j = 0,len=this.fileList.length; j < len; j++) {
                    if(j===len-1){
                        orderForm.order_images+=this.fileList[j].url
                    }else{
                        orderForm.order_images+=this.fileList[j].url+','
                    }
                }
                console.log(orderForm)
                Order_API.newOrder(orderForm).then(res=>{
                    this.$message.success("发布成功，等待报价")
                    this.toHome()
                }).catch(err=>{
                    alert(err)
                })
            //    发布悬赏请求
            }
        }

    }
</script>

<style scoped>
</style>

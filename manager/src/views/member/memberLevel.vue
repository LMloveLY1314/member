<template>
    <div style="margin-top: 10px">
        <en-table-layout :tableData="tableData.records">
            <!--      工具栏-->
            <div slot="toolbar" class="inner-toolbar">
                <div class="toolbar-search">
                    <search
                            @search="searchEvent"
                            @advancedSearch="advancedSearchEvent"
                            @cleanForm="cleanFormEvent"
                            advanced
                    >
                        <template slot="advanced-content">
                            <el-form ref="advancedForm" :model="advancedForm" label-width="80px">
                                <el-form-item label="用户名" prop="uname">
                                    <el-input size="medium"  v-model="advancedForm.uname" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="手机号" prop="mobile">
                                    <el-input size="medium"  v-model="advancedForm.mobile" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="会员性别" prop="sex">
                                    <el-radio-group v-model="advancedForm.sex">
                                        <el-radio :label="1">男</el-radio>
                                        <el-radio :label="0">女</el-radio>
                                        <el-radio :label="-1">不限</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="注册时间区间" prop="register_time_range">
                                    <el-date-picker
                                            v-model="advancedForm.register_time_range"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="timestamp"
                                            style="width: 324px"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-form>
                        </template>
                    </search>
                </div>
            </div>
            <template slot="table-columns">
                <el-table-column
                        prop="uname"
                        label="用户名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="注册时间"
                        width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.create_time === null">NULL</span>
                        <span v-else>{{ scope.row.create_time | unixToDate }}</span>
                    </template>

                </el-table-column>

                <el-table-column
                        label="上次登录时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.last_login === null">NULL</span>
                        <span v-else>{{ scope.row.last_login | unixToDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="login_count"
                        label="登录次数">
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别"
                        :formatter="formatterSex" width="80px">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="handleRecoveryConsumer(scope.$index, scope.row)"
                        >恢复</el-button>
                    </template>
                </el-table-column>
            </template>
            <!--    分页工具栏        -->
            <el-pagination
                    v-if="tableData"
                    slot="pagination"
                    @size-change="handlePageSizeChange"
                    @current-change="handlePageCurrentChange"
                    :current-page="parseInt(tableData.current)"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="parseInt(tableData.size)"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="parseInt(tableData.total)">
            </el-pagination>
        </en-table-layout>

    </div>
</template>

<script>
    import * as API_member from "@/api/member";
    import Search from "@/components/TableSearch/index";
    export default {
        name: "memberLevel",
        components:{
            Search
        },
        data(){
            return{
                //获取地区的路径
                api:'http://localhost:7003/regions/@id/children',
                /** 列表loading状态 */
                loading: false,
                /** 编辑会员窗体*/
                editDialogForm:false,
                /** 添加会员窗体是否显示*/
                dialogFormVisible:false,
                /** 列表参数 */
                params: {
                    pageNo: 1,
                    pageSize: 10
                },
                /** 列表数据*/
                tableData: '',
                advancedForm: {
                    uname:'',
                    mobile:'',
                    sex:'',
                    register_time_range:'',
                },
                /**添加会员表单*/
                addRepairForm:{
                },
                /**添加会员的验证规则*/
                addRepairRules:{

                },
                pwdType: "password",

            }
        },
        methods:{
            //发送请求，获取维修师傅列表数据
            GET_MemberList() {
                this.loading = true
                // const  user_type=0
                const  disabled=-1
                // this.params.user_type=user_type
                this.params.disabled=disabled
              API_member.getMemberList(this.params).then(response => {
                    this.loading = false
                    //响应的数据赋值给tableData
                    this.tableData = response
                }).catch(() => (this.loading = false))
            },

            /** 搜索事件触发 */
            searchEvent(data) {   //拼接查询参数，从查询参数中清除高级查询中的参数
                this.params = {
                    ...this.params,
                    keyword: data
                }
                this.params.page_no = 1
                Object.keys(this.advancedForm).forEach(key => delete this.params[key])
                this.GET_RepairList()
            },

            /** 高级搜索事件触发 */
            advancedSearchEvent() {
                const { advancedForm } = this;
                const { register_time_range, sex } = advancedForm;
                //遍历高级查询表单，如果表单有值且不为''，添加到查询参数中
                Object.keys(this.advancedForm).forEach(key => {
                    if (advancedForm[key] !== undefined&&advancedForm[key]!=='') {
                        this.params[key] = advancedForm[key];
                    }
                });
                //如果根据时间段来查，则获取两个时间段的秒数
                if (register_time_range && register_time_range.length === 2) {
                    this.params.start_time = register_time_range[0] / 1000;
                    this.params.end_time = register_time_range[1] / 1000;
                }else{
                    delete this.params.start_time
                    delete this.params.end_time
                }
                //删除区间和关键字
                delete this.params.register_time_range;
                delete this.params.keyword;
                //-1表示不限性别，则不添加
                if (sex === -1) delete this.params.sex;
                this.params.page_no = 1;
                this.GET_RepairList();
            },
            cleanFormEvent(){//监听Search组件的清空表单方法
                /**在el-form-item项上加了prop属性才重置成功
                 * 但清空表单的方法是通用的，但官方不建议在子组件中直接修改父组件的数据，所以通过触发事件，由父组件来处理
                 *
                 * 注意：清空表单是让表单数据回到初始值，如果创建组件的时候就指定了初始值，那再清空，还是回到初始值
                 *
                 * 清空之后，再将其从查询参数里删除
                 **/
                const $form=this.$refs.advancedForm.resetFields();
                Object.keys(this.advancedForm).forEach(key => delete this.params[key])


            },
            /** 分页大小发生改变 */
            handlePageSizeChange(size) {
                this.params.page_size = size;
                this.GET_RepairList();
            },

            /** 分页页数发生改变 */
            handlePageCurrentChange(page) {
                this.params.page_no = page;
                this.GET_RepairList();
            },
            /**编辑会员，跳转编辑会员*/
            handleRecoveryConsumer(index,row){
                API_repair.recoveryRepair(row.user_id).then(()=>{
                    this.$message.success("恢复成功！");
                    this.GET_RepairList();
                })
            },
            submitAddRepairForm(form){
                alert("提交")
            },
            closeDialog(){

            },
            /** 性别格式化 */
            formatterSex(row, column, cellValue) {
                return row.sex === 1 ? "男" : "女";
            },
        },
        mounted() {//初始化请求全部数据
            this.GET_MemberList();
        }
    }
</script>

<style scoped>

</style>

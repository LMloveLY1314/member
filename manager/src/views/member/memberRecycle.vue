<template>
    <div style="margin-top: 10px">
        <en-table-layout :tableData="tableData.records">
            <!--      工具栏-->
            <div slot="toolbar" class="inner-toolbar">
                <div class="toolbar-search">
                    <search
                            @search="searchEvent"
                    >
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
    import * as API_member from "@/api/member.js";
    import Search from "@/components/TableSearch/index";
    export default {
        name: "memberRecycle",
        components:{
            Search
        },
        data(){
            return{
                //获取地区的路径
                api:'http://localhost:7003/regions/@id/children',
                /** 列表loading状态 */
                loading: false,
                /** 列表参数 */
                params: {
                    pageNo: 1,
                    pageSize: 10
                },
                /** 列表数据*/
                tableData: '',
            }
        },
        methods:{
            //发送请求，获取维修师傅列表数据
            GET_MemberRecycleList() {
                this.loading = true
                //设置查询禁用状态
                const  disabled=-1
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
                this.params.pageNo = 1
                this.GET_MemberRecycleList(  this.params)
            },

            /** 分页大小发生改变 */
            handlePageSizeChange(size) {
                this.params.pageSize = size;
                this.GET_MemberRecycleList();
            },

            /** 分页页数发生改变 */
            handlePageCurrentChange(page) {
                this.params.pageNo = page;
                this.GET_MemberRecycleList();
            },


        },
        mounted() {//初始化请求全部数据
            this.GET_MemberRecycleList();
        }
    }
</script>

<style scoped>

</style>

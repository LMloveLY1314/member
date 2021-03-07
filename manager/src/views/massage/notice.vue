<template>
    <div style="margin-top: 10px">
        <en-table-layout :tableData="tableData.records">
            <!--      工具栏-->
            <div slot="toolbar" class="inner-toolbar">
                <div class="toolbar-btns">
                    <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-circle-plus-outline"
                            @click="dialogFormVisible = true"
                    >添加</el-button>
                </div>
                <div class="toolbar-search">
                    <search
                            @search="searchEvent"
                    >
                    </search>
                </div>
            </div>
            <template slot="table-columns">
                <el-table-column
                        prop="title"
                        label="公告标题"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型"
                        width="180">
                </el-table-column>

                <el-table-column
                        label="发布时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.createTime === null">NULL</span>
<!--                        <span v-else>{{ scope.row.create_time | unixToDate }}</span>-->
                        <span v-else>{{ scope.row.createTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="消息内容">
                </el-table-column>

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary" plain
                        @click="handleGetNotice(scope.$index, scope.row,1)"
                      >查看</el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click="handleGetNotice(scope.$index, scope.row,0)"
                      >编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDeleteNotice(scope.$index, scope.row)"
                        >删除</el-button>
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
<!--        添加公告窗体-->
        <el-dialog
                :title="addNoticeForm.id?this.type==1?'查看公告':'编辑公告':'发布公告' "
                :visible.sync="dialogFormVisible"
                width="500px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="closeDialog"
        >
            <el-form :model="addNoticeForm"  ref="addNoticeForm" :rules="addNoticeRules"  label-width="100px" @close="closeDialog">
                <el-form-item label="消息标题" prop="title">
                    <el-input @input="change($event)" v-model="addNoticeForm.title" :maxlength="20" placeholder="标题在20字以内"></el-input>
                </el-form-item>
                <el-form-item label="消息内容" prop="content">
                    <el-input
                            @input="change($event)"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入消息内容"
                            v-model="addNoticeForm.content"
                            :maxlength="2000">
                    </el-input>
                </el-form-item>
                <el-form-item label="消息类型">
                    <el-radio-group v-model="addNoticeForm.type">
                        <el-radio :label="0">系统公告</el-radio>
                        <el-radio :label="1">指定用户</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="this.type==0" type="primary" @click="submitAddNoticeForm">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
    import Search from "../../components/TableSearch/index";
    import * as API_Notice from "@/api/massage";
    export default {
        name: "notice",
        components:{
            Search,
        },
        data(){
            return{
                /** 列表loading状态 */
                loading: false,
                /** 添加公告窗体是否显示*/
                dialogFormVisible:false,
                /** 列表参数 */
                params: {
                    pageNo: 1,
                    pageSize: 10,
                },
                /** 列表数据*/
                tableData: '',

                /**添加公告表单*/
                addNoticeForm:{
                    title:'',
                    content:'',
                    type:'',
                    id:null,
                    createTime:null,
                },
                /**添加公告的验证规则*/
                addNoticeRules:{

                },
               /** 编辑/查看公告：edit*/
                type:0,

            }
        },
        methods:{
            GET_NoticeList() {
                this.loading = true
                API_Notice.getNoticeList(this.params).then(response => {
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
                this.GET_NoticeList()
            },
            /** 分页大小发生改变 */
            handlePageSizeChange(size) {
                this.params.page_size = size;
                this.GET_NoticeList();
            },

            /** 分页页数发生改变 */
            handlePageCurrentChange(page) {
                this.params.page_no = page;
                this.GET_NoticeList();
            },
            handleDeleteNotice(index, row) {
                this.$confirm("确定要删除这个公告吗？", "提示", { type: "warning" })
                    .then(() => {
                        API_Notice.deleteNotice(row.id).then(() => {
                            this.$message.success("删除成功！");
                            this.GET_NoticeList();
                        });
                    })
                    .catch(() => {});
            },
            //查看公告详情
            handleGetNotice(index, row,type){
              //编辑或查看
              this.type=type
              this.dialogFormVisible=true
              API_Notice.getNoticeById(row.id).then((res)=>{
                this.addNoticeForm=res
              })
            },
            submitAddNoticeForm(){
                const form=this.addNoticeForm
                console.log(form)
                API_Notice.addNotice(form).then(()=>{
                    this.$message.success("添加成功")
                    this.dialogFormVisible = false
                    this.GET_NoticeList();
                })
            },
            closeDialog(){
              this.$refs['addNoticeForm'].resetFields();
              this.dialogFormVisible=false
              this.type=0
            },

        },
        mounted() {//初始化请求全部数据
            this.GET_NoticeList();
        }
    }
</script>

<style scoped>

</style>

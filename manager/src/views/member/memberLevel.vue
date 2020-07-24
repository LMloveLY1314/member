<template>
    <div style="margin-top: 10px">
        <en-table-layout :tableData="tableData.records">
            <!--      工具栏-->
            <div slot="toolbar" class="inner-toolbar">
              <div class="toolbar-btns">
                <el-button
                  size="mini"
                  type="warning"
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
                        prop="levelName"
                        label="等级名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="openCost"
                        label="开卡费用"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="修改时间"
                        prop="editTime"
                        width="180">
                </el-table-column>

                <el-table-column
                        label="有效时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.effectiveTime" >{{  scope.row.effectiveTime==0?'永远': scope.row.effectiveTime+'天'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="initialAmount"
                        label="初始金额">
                </el-table-column>
                <el-table-column
                        prop="initialPoints"
                        label="初始积分"
                        width="80px">
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleEditLevel(scope.$index, scope.row)"
                    >编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDeleteLevel(scope.$index, scope.row)"
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
      <!--添加等级 dialog-->
      <el-dialog title="添加等级" :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form
          :model="advancedForm"
          :rules="addLevelRules"
          ref="advancedForm"
          label-width="100px"
          inline
        >
          <!--用户名-->
          <el-form-item label="等级名称" prop="levelName">
            <el-input v-model="advancedForm.levelName" :maxlength="20"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item label="开卡金额" prop="openCost">
            <el-input v-model="advancedForm.openCost"></el-input>
          </el-form-item>
          <!--性别-->
          <el-form-item label="初始金额" prop="initialAmount" class="form-item-sex">
            <el-input v-model="advancedForm.initialAmount"></el-input>
          </el-form-item>
          <!--                region为地区id-->
          <el-form-item label="初始积分" prop="initialPoints" class="form-item-region">
            <el-input v-model="advancedForm.initialPoints"></el-input>
          </el-form-item>
          <!--生日-->
          <el-form-item label="快速消费（元/积分）" prop="consumptionPoints">
            <el-input v-model="advancedForm.consumptionPoints"></el-input>
          </el-form-item>
          <!--邮箱-->
          <el-form-item label="会员充值（元/积分）" prop="rechargePoints">
            <el-input v-model="advancedForm.rechargePoints"></el-input>
          </el-form-item>
          <!--手机号码-->
          <el-form-item label="有效期" prop="effectiveTime">
            <el-input v-model.number="advancedForm.effectiveTime" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddLevelForm">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import * as API_Level from "@/api/level";
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
                /** 添加等级窗体是否显示*/
                dialogFormVisible:false,
                /** 列表参数 */
                params: {
                    pageNo: 1,
                    pageSize: 10,
                    levelName:''
                },
                /** 列表数据*/
                tableData: '',
                advancedForm: {
                    levelName:'',
                    openCost:'',
                    initialAmount:'',
                    initialPoints:'',
                    consumptionPoints:'',
                    rechargePoints:'',
                    effectiveTime:''
                },

                /**添加会员的验证规则*/
                addLevelRules:{

                },
            }
        },
        methods:{
            //确定添加
          submitAddLevelForm(){
            if(this.advancedForm.levelId){
              API_Level.editLevel(this.advancedForm.levelId,this.advancedForm).then(()=>{
                this.$message.success("修改成功")
                this.dialogFormVisible=false
                this.GET_LevelList()
              })
            }else {
              API_Level.addLevel(this.advancedForm).then(()=>{
                this.dialogVisible = false
                this.$message.success("添加成功")
                this.GET_LevelList()
              }).catch(()=>{
                this.$message.error("添加失败")
              })
            }
          },
            //编辑等级
          handleEditLevel(index, row){
            API_Level.getLevelDetail(row.levelId).then((res)=>{
              this.advancedForm=res.data
              this.dialogFormVisible=true
            })

          },
            //删除等级
          handleDeleteLevel(index, row){
            this.$confirm("确定要删除这个等级吗？", "提示", { type: "warning" })
              .then(() => {n
                API_Level.deleteLevel(row.levelId).then(() => {
                  this.$message.success("删除成功！");
                  this.GET_LevelList();
                });
              })
              .catch(() => {});
          },
            //发送请求，获取维修师傅列表数据
            GET_LevelList() {
                this.loading = true
              API_Level.getLevelList(this.params).then(response => {
                    this.loading = false
                    //响应的数据赋值给tableData
                    this.tableData = response
                }).catch(() => (this.loading = false))
            },

            /** 搜索事件触发 */
            searchEvent(data) {   //拼接查询参数，从查询参数中清除高级查询中的参数
                this.params.levelName=data
                this.params.pageNo = 1
                this.GET_LevelList()
            },

            /** 分页大小发生改变 */
            handlePageSizeChange(size) {
                this.params.pageSize = size;
                this.GET_LevelList();
            },

            /** 分页页数发生改变 */
            handlePageCurrentChange(page) {
                this.params.pageNo = page;
                this.GET_LevelList();
            },
            closeDialog(){
              this.$refs['advancedForm'].resetFields();
              this.dialogFormVisible=false
            },
        },
        mounted() {//初始化请求全部数据
            this.GET_LevelList();
        }
    }
</script>

<style scoped>

</style>

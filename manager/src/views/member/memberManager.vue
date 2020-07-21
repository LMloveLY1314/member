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
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-circle-plus-outline"
            @click="handleExcel"
          >导出Excel</el-button>
        </div>
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
          prop="kh"
          label="卡号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="memberName"
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
<!--            <span v-if="scope.row.createime === null">NULL</span>-->
            <span>{{ scope.row.createTime }}</span>
          </template>

        </el-table-column>

        <el-table-column
          label="上次登录时间">
          <template slot-scope="scope">
            <span >{{ scope.row.lastLogin}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginCount"
          label="登录次数">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          :formatter="formatterSex" width="80px"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditRepair(scope.$index, scope.row)"
            >操作</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteMember(scope.$index, scope.row)"
            >禁用</el-button>
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
    <!--添加会员 dialog-->
    <el-dialog title="添加会员" :visible.sync="dialogFormVisible">
      <el-form
        :model="addConsumerForm"
        :rules="addRepairRules"
        ref="addRepairForm"
        label-width="100px"
        inline
      >
        <!--用户名-->
        <el-form-item label="用户名" prop="merberName">
          <el-input v-model="addConsumerForm.memberName" :maxlength="20"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addConsumerForm.password" :type="pwdType" :maxlength="20"></el-input>
          <span class="show-pwd" @click="pwdType = pwdType === 'password' ? 'text' : 'password'">
                    <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
        </el-form-item>
        <!--性别-->
        <el-form-item label="性别" class="form-item-sex">
          <el-radio v-model="addConsumerForm.sex" :label="1">男</el-radio>
          <el-radio v-model="addConsumerForm.sex" :label="0">女</el-radio>
        </el-form-item>
        <!--                region为地区id-->
        <el-form-item label="地区" prop="region" class="form-item-region">
          <en-region-picker
            v-model="addConsumerForm.address"
            :api="api"
            @changed="handleAddressSelectorChanged"
          />
        </el-form-item>
        <!--生日-->
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="addConsumerForm.birthday"
            type="date"
            :editable="false"
            value-format="timestamp"
            placeholder="选择生日"
            :picker-options="{disabledDate(time) { return time.getTime() > Date.now() }}"
          ></el-date-picker>
        </el-form-item>
        <!--邮箱-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addConsumerForm.email"></el-input>
        </el-form-item>
        <!--手机号码-->
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.number="addConsumerForm.mobile" :maxlength="11"></el-input>
        </el-form-item>
        <!--固定电话-->
        <el-form-item label="固定电话">
          <el-input v-model.number="addConsumerForm.tel" :maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddConsumerForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Search from "@/components/TableSearch";
  import * as API_Member from "@/api/member";
  // import {Foundation,RegExp } from '../../../ui-utils/index'

  export default {
    name: "memberManager",
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
        addConsumerForm:{
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
        const  disabled=1
        this.params.disabled=disabled
        // this.params.user_type=0
        API_Member.getMemberList(this.params).then(response => {
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
      handleDeleteMember(index, row) {
        this.$confirm("确定要禁用这个会员吗？", "提示", { type: "warning" })
          .then(() => {
            API_repair.deleteMember(row.memberId).then(() => {
              this.$message.success("禁用成功！");
              this.GET_RepairList();
            });
          })
          .catch(() => {});
      },
      /**编辑会员，跳转编辑会员*/
      handleEditRepair(index,row){
        this.$router.push({
          name: "consumerEdit",
          params: {
            id: row.memberId,
          }
        });
      },
      submitAddConsumerForm(){
        API_repair.addConsumer(this.addConsumerForm).then(()=>{
          this.$message.success("添加成功");
          this.dialogFormVisible = false
          this.GET_RepairList();
        })
      },
      /** 地址选择器发生改变
       * 设置最底层地区id和地址
       * */
      handleAddressSelectorChanged(object) {
        //设置地区相关数据
        console.log(object)
        this.addConsumerForm.address=object.string
        this.addConsumerForm.region=object.regions.last_id   //最底层地区id
        this.addConsumerForm.city_id=object.regions.city.id  //城市id
        this.addConsumerForm.province_id=object.regions.province.id  //省份id
        this.addConsumerForm.county_id=object.regions.region.id    //城镇id
        //设置地区名称
        this.addConsumerForm.province=object.regions.province  //城市id
        this.addConsumerForm.city=object.regions.city  //省份id
        this.addConsumerForm.county=object.regions.region    //城镇id
        if(object.regions.town.id){
          this.addConsumerForm.town_id=object.regions.town.id
          this.addConsumerForm.town=object.regions.town
        }
      },
      /** 性别格式化 */
      formatterSex(row, column, cellValue) {
        return row.sex === 1 ? "男" : "女";
      },
      //导出会员数据
      handleExcel(){
          API_Member.exportMemberData(0).then(response => {
              const json = {
                  sheet_name: '四火会员管理系统会员基本信息',
                  sheet_values: response.map(item => ({
                      '卡号':item.kh,
                      '会员名称': item.member_name,
                      '手机号': item.mobile,
                      '地址': item.address,
                      '邮箱': item.email,
                      '注册时间': item.create_time ,
                      '上次登录时间': item.last_login,
                      '登录次数': item.login_count,
                      '性别':item.sex==0? '男':'女',

                  }))
              }
              this.MixinExportJosnToExcel(json, '四火会员管理系统会员基本信息')
          });
      },

    },
    mounted() {//初始化请求全部数据
      this.GET_MemberList();
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .show-pwd {
    position: absolute;
    top: 0;
    right: 10px;
    cursor: pointer;
  }

  .el-date-editor.el-input {
    width: 180px;
  }

  /deep/ .form-item-sex .el-form-item__content {
    width: 180px;
  }

  /deep/ .form-item-region .el-form-item__content {
    min-width: 180px;
  }
  /deep/.el-form .el-form-item__content {
    width: 210px !important;
    .el-date-editor {
      width: 100%;
    }
  }
  /deep/ .el-radio-group {
    white-space: nowrap;
  }
  /deep/ .el-radio + .el-radio {
    margin-left: 10px;
  }

  body {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
    overflow: auto;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
  .tb-edit .el-input {
    display: none;
  }
  .tb-edit .current-row .el-input {
    display: block;
  }
  .tb-edit .current-row .el-input + span {
    display: none;
  }
  .btn {
    float: right;
    margin-bottom: 10px;
    margin-right: 45px;
  }
  /deep/ .app-address {
    /* position: relative; */
    min-width: 20%;
    height: 26px;
    font-size: 12px;
    z-index: 1000;
  }
  /** 工具栏样式 */

</style>

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
            @click="handleAddMember"
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
            >编辑</el-button>
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
    <!--添加会员 dialog
    element-ui的弹出层组件
    属性： visible.sync，定义该窗体是否可见，false：不可见，true：可见
    初始状态（false），点击添加或修改按钮（修改值为true）就显示窗体
    -->
    <el-dialog :title="addMemberForm.memberId?'编辑会员':'添加会员'"
               :visible.sync="dialogFormVisible"
               @open="handleDialogOpen"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               style="height: 600px"
    >
<!--      element-ui的form（form表单）组件
           :model绑定表单对象
           双向数据绑定
           表单的双向绑定，用v-model（:model）绑定元素，当元素的值发生改变，该对象的值也改变，同样的，对象的值改变，元素的值也改变
-->
      <el-form
        :model="addMemberForm"
        :rules="addRepairRules"
        ref="addRepairForm"
        label-width="80px"
        inline
      >
        <div>
          <div id="left" style="width: 50%;float: left;height: 280px;margin-top: 10px;">
            <el-form-item label="会员名称" prop="merberName">
              <el-input v-model="addMemberForm.memberName" :maxlength="20"></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item label="密码" prop="password">
              <el-input v-model="addMemberForm.password" :type="pwdType" :maxlength="20"></el-input>
              <span class="show-pwd" @click="pwdType = pwdType === 'password' ? 'text' : 'password'">
                      <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
            </el-form-item>
            <!--性别-->
            <el-form-item label="性别" class="form-item-sex">
              <el-radio v-model="addMemberForm.sex" :label="1">男</el-radio>
              <el-radio v-model="addMemberForm.sex" :label="0">女</el-radio>
            </el-form-item>
            <!--手机号码-->
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model.number="addMemberForm.mobile" :maxlength="11"></el-input>
            </el-form-item>
            <!--固定电话-->
            <el-form-item label="固定电话" prop="tel">
              <el-input v-model.number="addMemberForm.tel" :maxlength="20"></el-input>
            </el-form-item>
          </div>
          <div id="right" style="width: 50%;float: right;height: 280px;margin-top: 10px;">
            <!--          <el-form-item label="地区" prop="address" class="form-item-region">-->
            <!--            <el-input v-model="addMemberForm.address"></el-input>-->
            <!--          </el-form-item>-->
            <el-form-item label="会员等级">
              <el-select
                v-model="addMemberForm.levelId"
                @change="levelChange"
                clearable>
                <el-option
                  v-for="item in levelOptions"
                  :key="item.level_id"
                  :label="item.level_name"
                  :value="item.level_id">
                </el-option>
              </el-select>
            </el-form-item>
            <!--生日-->
            <el-form-item name="name" label="生日" prop="birthday">
              <el-date-picker
                v-model="addMemberForm.birthday"
                type="date"
                :editable="false"
                placeholder="选择生日"
                :picker-options="{disabledDate(time) { return time.getTime() > Date.now() }}"
              ></el-date-picker>
            </el-form-item>
            <!--邮箱-->
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addMemberForm.email"></el-input>
            </el-form-item>
            <!--          会员卡号-->
            <el-form-item label="卡号" prop="kh">
              <el-input v-model="addMemberForm.kh" :disabled="true"></el-input>
            </el-form-item>

            <!--          身份证号-->
            <el-form-item label="身份证号" prop="midentity">
              <el-input v-model="addMemberForm.midentity" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </div>
        <div style="height:20px;height: 350px ">
          <!--          地区-->
          <el-form-item label="详细地址">
            <el-row :gutter="10">
              <el-col :span="3" style="padding-left: 0;">
                <el-form-item label="" prop="provinceId" label-width="0" style="margin-bottom: 0">
                  <el-select v-model="addMemberForm.provinceId" placeholder="请选择省" @change="provinceChange">
                    <el-option v-for="province in provinceArr" :key="province.id" :label="province.name" :value="province.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="padding-left: 0;">
                <el-form-item label="" prop="cityId" label-width="0" style="margin-bottom: 0;">
                  <el-select v-model="addMemberForm.cityId" placeholder="请选择市" @change="cityChange">
                    <el-option v-for="city in cityArr" :key="city.id" :label="city.name" :value="city.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="padding-left: 0;">
                <el-form-item label="" prop="countyId" style="margin-bottom: 0;">
                  <el-select v-model="addMemberForm.countyId" placeholder="请选择区">
                    <el-option v-for="county in countyArr" :key="county.id" :label="county.name" :value="county.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="padding-left: 0;">
                <el-form-item label="" prop="addressDetail" style="margin-bottom: 0;">
                  <el-input v-model.trim="addMemberForm.address" maxlength="50" placeholder="请输入详细地址" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <!---->
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
  import * as API_Level from "@/api/level"
  import * as API_Area from "@/api/area"
  // import {Foundation,RegExp } from '../../../ui-utils/index'

  export default {
    name: "memberManager",
    components:{
      Search
    },
    data(){
      return{
        /** 列表loading状态 */
        loading: false,
        /** 编辑会员窗体*/
        editDialogForm:false,
        /** 添加会员窗体是否显示*/
        dialogFormVisible:false,
        // 所属区域数据源
        areaArr: [],
        // 省数据源
        provinceArr: [],
        // 市数据源
        cityArr: [],
        // 区/县数据源
        countyArr: [],
        /** 列表参数 */
        params: {
          pageNo: 1,
          pageSize: 10
        },
        /** 列表数据*/
        tableData: '',
        advancedForm: {
          memberName:'',
          mobile:'',
          sex:'',
          register_time_range:'',
        },
        /**添加会员表单*/
        addMemberForm:{

        },
        /**添加会员的验证规则*/
        addRepairRules:{


        },
        pwdType: "password",
        levelOptions:[],//会员等级名称列表

      }
    },
    methods:{
      //打开添加会员窗体
      handleAddMember(){
        this.addMemberForm={}
        this.dialogFormVisible=true
      },
      //
      handleDialogOpen() {
        setTimeout(() => { this.$refs['adminForm'].clearValidate() })
      },
      //发送请求，获取会员列表
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
      //获取会员等级列表
      GET_LevelNameList(){
        API_Level.levelNameList().then((res)=>{
          this.levelOptions=res
        })
      },

      //改变选择的等级
      levelChange(event){
        //编辑等级列表，为会员等级id赋值
        this.addMemberForm.levelId=event
        console.log(event)
      },
      /** 搜索事件触发 */
      searchEvent(data) {   //拼接查询参数，从查询参数中清除高级查询中的参数
        this.params = {
          ...this.params,
          keyword: data
        }
        this.params.page_no = 1
        Object.keys(this.advancedForm).forEach(key => delete this.params[key])
        this.GET_MemberList()
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
        this.params.pageNo = 1;
        this.GET_MemberList();
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
        this.params.pageSize = size;
        this.GET_MemberList();
      },

      /** 分页页数发生改变 */
      handlePageCurrentChange(page) {
        this.params.pageNo = page;
        this.GET_MemberList();
      },
      handleDeleteMember(index, row) {
        this.$confirm("确定要禁用这个会员吗？", "提示", { type: "warning" })
          .then(() => {
            API_Member.disableMember(row.memberId).then(() => {
              this.$message.success("禁用成功！");
              this.GET_MemberList();
            });
          })
          .catch(() => {});
      },
      /**编辑会员，打开编辑会员窗体*/
      handleEditRepair(index,row){
          this.dialogFormVisible=true
          API_Member.getByMemberId(row.memberId).then(res=>{
            this.getAreaList(0, 'provinceArr')
            this.getAreaList(res.provinceId, 'cityArr')
            this.getAreaList(res.cityId, 'countyArr')
            this.addMemberForm=res
          })
      },
      submitAddConsumerForm(){
        if (this.addMemberForm.memberId){
          API_Member.editMember(this.addMemberForm).then(()=>{
            this.$message.success("编辑成功");
            this.dialogFormVisible = false
            this.GET_MemberList();
          })
        }else {
          API_Member.addMember(this.addMemberForm).then(()=>{
            this.$message.success("添加成功");
            this.dialogFormVisible = false
            this.GET_MemberList();
          })
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
      //根据上级id获取地区列表
      getAreaList(parentId, areaName) {
        API_Area.getAreaList({ parentId }).then(res => {
          this[areaName]= res.data

        }).catch(err => {
          console.log(err, 'err')
        })
      },
      // 选择省
      provinceChange(val) {
        this.getAreaList(val, 'cityArr')
      },
      // 选择市
      cityChange(val) {
        this.getAreaList(val, 'countyArr')
      },

    },
    //挂载时执行方法
    mounted() {//初始化请求全部数据
      this.GET_MemberList();
      this.GET_LevelNameList();
    },
    //创建时执行
    created() {
      this.getAreaList('0', 'provinceArr')
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

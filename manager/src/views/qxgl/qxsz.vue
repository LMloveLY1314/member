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
            @click="handleAddAdmin"
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
        <el-table-column prop="face" label="管理员头像">
          <template slot-scope="scope"><img :src="scope.row.face" class="face-image"></template>
        </el-table-column>
        <el-table-column prop="uname" label="管理员名称"/>
        <el-table-column prop="role_name" label="所属角色"/>
        <el-table-column prop="real_name" label="管理员真实姓名"/>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.date_line === null">NULL</span>
            <span v-else>{{ scope.row.date_line | unixToDate }}</span>
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
              @click="handleEditAdmin(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteAdmin(scope.$index, scope.row)"
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
        :current-page="tableData.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="tableData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </en-table-layout>
    <el-dialog
      :title="adminForm.id ? '编辑管理员' : '添加管理员'"
      :visible.sync="dialogVisible"
      width="500px"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="adminForm" :rules="adminRules" ref="adminForm" label-width="120px">
        <el-form-item label="管理员名称" prop="uname">
          <span v-if="adminForm.id">{{ adminForm.uname }}</span>
          <el-input v-else v-model="adminForm.uname" :maxlength="20" clearable placeholder="请输入管理员名称"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input type="password" v-model="adminForm.password" :maxlength="20" clearable :placeholder="adminForm.id ? '不修改请留空' : '6-20位数字、英文字母'"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select

            v-model="adminForm.role_id"
            :disabled="adminForm.founder === 1"
            :placeholder="adminForm.founder === 1 ? '超级管理员无须选择角色' : '请选择角色'"
            @change="roleChange"
            clearable
          >
            <el-option
              v-for="item in rolesOptions"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员真实姓名" prop="real_name">
          <el-input v-model="adminForm.real_name" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="adminForm.remark" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="管理员头像" prop="face">
          <el-upload
            :action="uploadApi"
            :on-success="(res) => { adminForm.face = res.url }"
            :on-remove="() => { adminForm.face = '' }"
            :file-list="adminForm.face"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="超级管理员">
          <el-radio v-model="adminForm.founder" :label="1">是</el-radio>
          <el-radio v-model="adminForm.founder" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRepairForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import Search from '@/components/TableSearch/index'
export default {
  name: 'txmccx',
  components:{
    Search
  },
  data(){
    return{
      uploadApi:'http://localhost:7003/uploaders',
      /** 列表loading状态 */
      loading: false,
      /** 编辑管理员窗体*/
      dialogVisible:false,
      /** 列表参数 */
      params: {
        page_no: 1,
        page_size: 10,
      },
      /** 列表数据*/
      tableData: '',

      /**添加管理员表单*/
      adminForm:{
        role_name:'',
      },
      /**添加管理员的验证规则*/
      adminRules: {

      },
      rolesOptions: [],
    }
  },
  methods:{
    //发送请求，获取维修师傅列表数据
    GET_AdminList() {
      this.loading = true
      API_Auth.getAdminList(this.params).then(response => {
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
    //删除管理员
    handleDeleteAdmin(index, row) {
      this.$confirm("确定要删除这个会员吗？", "提示", { type: "warning" })
        .then(() => {
          API_Auth.deleteAdminUser(row.id).then(() => {
            this.$message.success("删除成功！");
            this.GET_AdminList();
          });
        })
        .catch(() => {});
    },
    /**编辑管理员*/
    handleEditAdmin(index,row){
      //显示编辑窗体，查询管理员详细
      this.adminForm.id=row.id
      this.dialogVisible=true
      API_Auth.getAdminUser(this.adminForm.id).then((response)=>{
        this.adminForm=response
      })
    },
    //添加管理员
    /** 添加管理员 */
    handleAddAdmin() {
      this.adminForm = {
        founder: 0
      }
      this.dialogVisible = true
    },
    //添加或修改管理员
    submitAddRepairForm(){
      // 根据选择的角色id设置角色名
      const params=this.adminForm
      this.rolesOptions.map(function(value){
        if(value.role_id==params.role_id){
          params.role_name=value.role_name
          return
        }
      })
      API_Auth.addAdminUser(params).then(()=>{
        this.dialogVisible = false
        this.$message.success("保存成功")
        this.GET_AdminList()
      }).catch(()=>{
        this.$message.error("保存失败")
      })


    },
    closeDialog(){

    },

    /** 性别格式化 */
    formatterSex(row, column, cellValue) {
      return row.sex === 1 ? "男" : "女";
    },

    handleDialogOpen() {
      setTimeout(() => { this.$refs['adminForm'].clearValidate() })
    },
    GET_RoleList(){
      API_Auth.getRoleAll().then((response)=>{
        this.rolesOptions=response;
      })
    },
    //    角色选择变化
    roleChange(event){
      alert(event)
      console.log(this.adminForm)

    }
  },
  mounted() {//初始化请求全部数据
    this.GET_AdminList();
    //    获取角色集合
    this.GET_RoleList()
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
  .face-image{
    width: 50px;
    height: 50px;
  }
</style>

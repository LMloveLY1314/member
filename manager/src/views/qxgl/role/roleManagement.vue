<template>
  <div style="margin-top: 10px">
    <en-table-layout
      :tableData="tableData.records"
      :loading="loading"
    >

      <!--      工具栏-->
      <div slot="toolbar" class="inner-toolbar">
        <div class="toolbar-btns">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-circle-plus-outline"
            @click="handleAddRole"
          >添加</el-button>
        </div>
<!--        <div class="toolbar-search">-->
<!--          <search-->
<!--            @search="searchEvent"-->
<!--          >-->
<!--          </search>-->
<!--        </div>-->
      </div>

      <template slot="table-columns">
        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column prop="roleDescribe" label="角色描述"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditRole(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteRole(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>

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
<!--    添加角色窗体-->
    <el-dialog
      :title="permissionForm.roleId ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="70%"
      @open="handleDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >

      <el-form :model="permissionForm" :rules="permissionRules" ref="permissionForm" label-width="200px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="permissionForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_describe">
          <el-input v-model="permissionForm.roleDescribe"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="permission">
          <el-checkbox :indeterminate="allIndeterminate" v-model="allCheck" @change="handleCheckAll">全部选择</el-checkbox>
          <div v-for="(item, index) in permissions" :key="item.identifier" class="level_1">
            <el-row :gutter="20">
              <el-col :span="4">
                <el-checkbox
                  v-model="item.checked"
                  :label="item.title"
                  :indeterminate="checkIndeterminate(item.children)"
                  @change="handleCheckboxChanged(item)"
                ></el-checkbox>
              </el-col>
              <el-col :span="20">
                <div v-for="(_item, _index) in item.children" :key="_item.identifier" class="checkbox-dropdown">
                  <el-checkbox
                    v-model="_item.checked"
                    :label="_item.title"
                    :indeterminate="checkIndeterminate(_item.children)"
                    @change="handleCheckboxChanged(_item, item)"
                  ></el-checkbox>
                  <template v-if="_item.children && _item.children.length">
                    <el-dropdown trigger="click" split-button :hide-on-click="false">
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(__item, __index) in _item.children" :key="__item.identifier">
                          <el-checkbox
                            v-model="__item.checked"
                            :label="__item.title"
                            @change="handleCheckboxChanged(__item, _item)"
                          ></el-checkbox>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRolePermission">取 消</el-button>
        <el-button type="primary" @click="saveRolePermission">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
import  * as API_Auth from '@/api/auth'
import  * as API_Menus from '@/api/menus'
import Search from '@/components/TableSearch/index'

export default{
	name:'roleManagement',
  components:{
	  Search
  },
  data() {
    return {
      dialogVisible:false,
      // 列表loading状态
      loading: false,
      // 列表参数
      params: {
        pageNo: 1,
        pageSize: 10,
        keyword:'',
      },
      // 列表数据
      tableData:{},
      /** 权限 表单 */
      permissionForm: {
        roleId:'',
        roleName: '',
        roleDescribe:'',
        menus:[],
      },
      /** 权限 表单规则 */
      permissionRules: {
        roleName: [
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      permissions: [],
      // 全选状态
      allCheck: false,
      // 全选不确定状态
      allIndeterminate: false
    }
  },
  mounted() {
    this.GET_RoleList()
  },
  methods: {
    /** 分页大小发生改变 */
    handlePageSizeChange(size) {
      this.params.pageSize = size
      this.GET_RoleList()
    },

    /** 分页页数发生改变 */
    handlePageCurrentChange(page) {
      this.params.pageNo = page
      this.GET_RoleList()
    },

    /** 添加角色 */
    handleAddRole() {
      this.dialogVisible=true
      this.roleId = 0
      API_Menus.getMenusChildren().then(res => {
        this.$set(this, 'permissions', res)
        this.countAllPermissions()
      })
    },

    /** 编辑角色 */
    handleEditRole(row) {
      this.dialogVisible=true
      this.permissionForm.roleId=row.roleId
      API_Menus.getMenusChildren().then(res => {
        // 如果this.role_id 不为0，说明是编辑。
        API_Auth.getRole(row.roleId).then(response => {
          this.roleId = response.roleId
          this.permissionForm.roleName = response.roleName
          this.permissionForm.roleDescribe = response.roleDescribe
          //获取该角色具有权限id，设置初始选中状态
          const checkedIds = this.expandRouters(response.menus)
          // console.log("角色选择的id"+checkedIds)
          this.$set(this, 'permissions', this.filterRoleRouter(res, checkedIds))
          this.countAllPermissions()
        })
      })
    },

    /** 删除角色 */
    handleDeleteRole(row) {
      this.$confirm('确定要删除这个角色吗？', '提示', { type: 'warning' }).then(() => {
        API_Auth.deleteRole(row.role_id).then(() => {
          this.$message.success('删除成功！')
          this.GET_RoleList()
        })
      }).catch(() => {})
    },

    /** 获取角色列表 */
    GET_RoleList() {
      this.loading = true
      API_Auth.getRoleList(this.params).then(response => {
        this.loading = false
        this.tableData = response
      }).catch(() => { this.loading = false })
    },
    handleDialogOpen() {


    },
    /** 取消编辑，清空表单*/
    cancelRolePermission(){
      this.dialogVisible=false
      this.$refs['permissionForm'].resetFields()
    },
    /** 保存角色权限 */
    saveRolePermission() {
      this.$refs['permissionForm'].validate(valid => {
        if (valid) {
          const params = {
            ...this.permissionForm,
            menus: this.permissions,
            // id: this.roleId
          }
          // this.permissionForm.menus= this.permissions
          // this.permissionForm.roleId=this.roleId
          this.roleId === 0
            ? API_Auth.addRole(params).then(() => saveSuccess())
            : API_Auth.editRole(this.roleId,params).then(() => saveSuccess())
          const saveSuccess = () => {
            this.$message.success('保存成功！')
            this.GET_RoleList()
          }
        } else {
          this.$message.error('表单填写有误，请检查！')
          return false
        }
      })
      this.dialogVisible=false
      this.$refs['permissionForm'].resetFields()
    },

    /**  权限选择操作*/

    /** 全选 */
    handleCheckAll(checked) {
      this.allIndeterminate = false
      this.$set(this, 'permissions', this.setPermissionsCheck(this.permissions, checked))
    },

    /** 设置权限状态 */
    setPermissionsCheck(permissions, checked) {
      const perm =  JSON.parse(JSON.stringify(permissions))
      perm.map(item => {
        item.checked = checked
        this.$set(item, 'checked', checked)
        if (item.children && item.children.length) {
          this.$set(item, 'children', this.setPermissionsCheck(item.children, checked))
        }
      })
      return perm
    },
    /** 检测是否有不确定性 */
    checkIndeterminate(permissions) {
      if (!Array.isArray(permissions)) return false
      const _len = permissions.length
      const __len = permissions.filter(item => item.checked).length
      return (__len !== 0) && (_len !== __len)
    },
    /** 选择 */
    handleCheckboxChanged(item, parent) {
      if (item.children && item.children.length) {
        this.$set(item, 'children', this.setPermissionsCheck(item.children, item.checked))
      }
      this.countAllPermissions()
      this.countParentChecked()
    },
    /** 获取所有权限展开后的长度、被选中的长度 */
    countAllPermissions(permissions) {
      permissions = permissions || this.permissions
      const _list = []
      permissions.forEach(item => {
        _list.push(item)
        if (item.children) _list.push(...this.countAllPermissions(item.children))
      })
      const length = _list.length
      const length_checked = _list.filter(_item => _item.checked).length
      this.allCheck = length === _list.filter(_item => _item.checked).length
      this.allIndeterminate = (length_checked !== 0) && (length !== length_checked)
      return _list
    },
    /** 计算所有父辈的选中状态 */
    countParentChecked(permissions) {
      permissions = permissions || this.permissions
      permissions.forEach(item => {
        if (item.children && item.children.length) {
          this.countParentChecked(item.children)
          const lenght = item.children.length
          const checked_length = item.children.filter(_item => _item.checked).length
          item.checked = !!checked_length
        }
      })
    },

    /** 展开路由的identifier */
    expandRouters(menus) {
      const routers = []
      menus.forEach(item => {
        console.log("选中状态:"+item)
        item.checked && routers.push(item.identifier)
        if (item.children && item.children.length) {
          routers.push(...this.expandRouters(item.children))
        }
      })
      return routers
    },
    /** 递归筛选被选中的路由 */
    filterRoleRouter(routers, ids) {
      const _routers = []
      routers.forEach(item => {
        if (ids.includes(item.identifier) || item.hidden) {
          item.checked = true
        } else {
          item.checked = false
        }
        if (item.children) {
          this.$set(item, 'children', this.filterRoleRouter(item.children, ids))
        }
        _routers.push(item)
      })
      return _routers
    }
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
  .level_1 {
    padding: 15px 0;
    border-bottom: 1px dashed #e7e7e7;
    width: 900px;
    &:last-child{ border-bottom: none }
  }
  /deep/ {
    .el-form-item__label {
      padding-top: 15px;
    }
    .el-form-item__content {
      border-left: 1px solid #e7e7e7;
      padding-left: 20px;
      padding-top: 15px;
      .el-form-item__error {
        padding-left: 20px;
      }
    }
    .el-form-item:last-child {
      .el-form-item__content {
        padding-top: 0;
      }
    }
    .el-form-item:not(:first-child) {
      border-top: 1px solid #e7e7e7;
      position: relative;
      &::after {
        content: ' ';
        width: 1px;
        height: 22px;
        background-color: #e7e7e7;
        position: absolute;
        top: -22px;
        left: 200px;
      }
    }
    .el-button-group {
      display: inline-block;
      .el-button {
        display: inline-block;
        padding: 0;
        border: none;
        &:focus, &:hover {
          color: #606266;
          border-color: #fff;
          background-color: #fff;
        }
      }
    }
  }
  .checkbox-dropdown {
    display: inline-block;
    min-width: 130px;
    cursor: pointer;
    .checked {
      color: #409EFF
    }
  }

</style>

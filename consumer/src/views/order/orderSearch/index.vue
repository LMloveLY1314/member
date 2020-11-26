<template>
  <div>
      <div class="item-header">
             <div style="margin-top: 20px">
                 <el-input
                         placeholder="请输入订单号进行搜索"
                         style="width: 70%;float: left;margin-left: 8%;"
                         @keyup.native.enter="search"
                 >
                     <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                 </el-input>

                 <el-button
                         type="success" round
                         style="float: right;margin-right: 10px"
                 >关闭</el-button>
             </div>
      </div>
      <div style="height: 2000px">bbbb</div>
  </div>
</template>

<script>
    import Header from '../../../components/header'
    export default {
        name: "OrderSearch",
        components:{
            Header
        }
    }
</script>

<style scoped>

</style>

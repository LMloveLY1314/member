<template>

<!--
    图形化组件：百度的echarts
    使用步骤：
    1.使用npm安装echarts插件
    2.在mian.js中引入该插件
    3.在页面上定义一个元素
    4.用echarts的init()方法初始化一个图表对象（这个对象是依托于3中定义的元素）
    5.根据相应数据，构建所需要的图表

-->
  <div class="dashboard-container">
<!--    最近新增会员列表-->
    <div>
      <el-card>
        <div slot="header" class="clearfix">
          <span>新增会员列表</span>
          <el-button style="float: right; padding: 3px 0" type="text"  @click="$router.push('/member/member-manager')">查看更多</el-button>
        </div>
        <el-table :data="memberList" border :height="300" style="width: 100%;">
          <el-table-column prop="memberName" label="用户名"/>
          <el-table-column prop="mobile" label="手机号"/>
          <el-table-column prop="email" label="电子邮箱"/>
          <el-table-column prop="level" label="会员等级"/>
          <el-table-column prop="sex" label="性别" :formatter="formatterSex" >
          </el-table-column>
          <el-table-column label="注册时间">
            <template slot-scope="scope">{{ scope.row.createTime}}</template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
<!--   会员增长趋势折线图 -->
      <div id="growthTrend" :style="{width: '100%', height: '450px',marginTop:'10px'}"></div>

<!--    各类型会员占比-->
    <div>
      <div style="text-align: center;font-size: 24px;color: #5406a3">各类型会员占比</div>
        <div style="margin-top: 20px;height: 450px;">
<!--          各性别会员占比-->
          <div id="sexProportion"
               :style="{width: '50%', height: '450px',float:'left'}"></div>
<!--          各年龄段会员占比-->
          <div id="ageProportion"
               :style="{width: '50%', height: '450px',float:'right'}"></div>
        </div>
        <div style="margin-top: 20px">
<!--          各地区会员占比-->
          <div id="regionProportion" style="width: 50%;height: 450px;float: left"></div>
<!--          各等级会员占比-->
          <div id="levelProportion" style="width: 50%;height: 450px;float: right"></div>

        </div>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import  * as API_Dashboard from '@/api/dashboard'

export default {
  name: 'dashboard',
  data(){
    return{
      memberList:[],
      sexData:'',
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted(){
    this.GetNewList();
    this.drawLine();
    this.drawSexProportion();
    this.drawAgeProportion();
    this.drawRegionProportion();
    this.drawLevelProportion();
  },
  methods: {
    //获取最近新增5个会员
    GetNewList(){
      API_Dashboard.getNewMemberList().then((res)=>{
         this.memberList=res
      })
    },
    //获取会员性别占比
    GetMember(){
      API_Dashboard.getSexProportion().then((res)=>{
        this.sexData=res
      })
    },
    //构建会员增长趋势折线图
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
    API_Dashboard.memberGrowthTrend().then((res)=>{
      let growthTrend = this.$echarts.init(document.getElementById('growthTrend'))
      // 绘制图表
      growthTrend.setOption({
        title: { text: '本年度各月份会员增长趋势' },
        xAxis: {
          type: 'category',
          data: res.name
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: res.data,
          type: 'line'
        }]
      });
    })

    },
  //  各会员性别占比
    drawSexProportion(){
      API_Dashboard.getSexProportion().then((res)=>{
        //使用echarts的init()方法初始化一个图表对象
        let sexProportion = this.$echarts.init(document.getElementById('sexProportion'))
        // 绘制图表，为图表对象设置值
        sexProportion.setOption({
            title: {
              text: '各性别会员占比',
              left: 'center'
            },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: res.name
          },
          series: [
            {
              name: '会员性别占比',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data:res.data
            }
          ]
        });
      })

    },
  //  各会员年龄段占比
    drawAgeProportion(){
      API_Dashboard.getAgeProportion().then((res)=>{
        let regionProportion = this.$echarts.init(document.getElementById('ageProportion'))
        // 绘制图表
        regionProportion.setOption({
          title: {
            text: '各年龄段会员占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: res.name
          },
          series: [
            {
              name: '各年龄段会员占比',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data:res.data
            }
          ]
        });
      })


    },
    //  各会员各地区占比
    drawRegionProportion(){
      API_Dashboard.getRegionProportion().then((res)=>{
        let regionProportion = this.$echarts.init(document.getElementById('regionProportion'))
        // 绘制图表
        regionProportion.setOption({
          title: {
            text: '各地区会员占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: res.name
          },
          series: [
            {
              name: '各地区会员占比',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data:res.data
            }
          ]
        });
      })

    },
    //  各会员各等级占比
    drawLevelProportion(){
      API_Dashboard.getLevelProportion().then((res)=>{
        let levelProportion = this.$echarts.init(document.getElementById('levelProportion'))
        // 绘制图表
        levelProportion.setOption({
          title: {
            text: '各等级会员占比',
            left: 'center'
          },          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: res.name
          },
          series: [
            {
              name: '各等级会员占比',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data:res.data
            }
          ]
        });
      })

    },
    /** 性别格式化 */
    formatterSex(row, column, cellValue) {
      return row.sex === 1 ? "男" : "女";
    },

  },

}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

</style>

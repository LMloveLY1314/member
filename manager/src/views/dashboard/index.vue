<template>
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
      <div style="margin-top: 20px">
        <div id="sexProportion"
             :style="{width: '50%', height: '450px',float:'left'}"></div>
        <div id="ageProportion"
             :style="{width: '50%', height: '450px',float:'right'}"></div>
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
  created() {
    // this.GetSexProportion();
  },
  mounted(){
    this.GetNewList();
    this.drawLine();
    this.drawSexProportion();
    this.drawAgeProportion();
  },
  methods: {
    //获取最近新增5个会员
    GetNewList(){
      API_Dashboard.getNewMemberList().then((res)=>{
         this.memberList=res
      })
    },
    //获取会员性别占比
    GetSexProportion(){
      API_Dashboard.getSexProportion().then((res)=>{
        this.sexData=res
      })
    },
    //构建会员增长趋势折线图
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let growthTrend = this.$echarts.init(document.getElementById('growthTrend'))
      // 绘制图表
      growthTrend.setOption({
        title: { text: '会员增长趋势' },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      });
    },
  //  各会员性别占比
    drawSexProportion(){
      // this.GetSexProportion()
      // console.log(this.sexData)
      API_Dashboard.getSexProportion().then((res)=>{
        let sexProportion = this.$echarts.init(document.getElementById('sexProportion'))
        // 绘制图表
        sexProportion.setOption({
          // title:'各性别会员占比',
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
      let ageProportion = this.$echarts.init(document.getElementById('ageProportion'))
      // 绘制图表
      ageProportion.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
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
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
            ]
          }
        ]
      });
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

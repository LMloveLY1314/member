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
<!--    会员各地区各级别占比：地图-->
    <div>
      <div class="sh">
        <el-form :model="levelForm" size="small" :validate-on-rule-change="false" label-width="20px" hide-required-asterisk inline>
          <el-form-item class="choose" prop="statusArr">
            <el-select v-model="levelForm.level" placeholder="请选择会员级别" style="width: 180px; margin-left: 20px;" class="select" default-first-option @change="handleLevelChange">
              <el-option v-for="(item, index) in levelList" :key="index" :label="item.level_name" :value="item.level_id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div id="areaCountByLevel" :style="{width: '100%', height: '450px',marginTop:'10px'}"></div>
    </div>


  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import  * as API_Dashboard from '@/api/dashboard'
import * as  API_Level from '@/api/level'

export default {
  name: 'dashboard',
  data(){
    return{
      memberList:[],
      sexData:'',
      //会员等级
      levelForm: {
        level: ''
      },
      //会员等级列表
      levelList: [],
      memberNumChart:null,
      resizeTimer: null,
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
    this.handleLevelChange();
    this.getMemberLevelList();
  },
  beforeDestroy() {
    if (!this.memberNumChart) {
      return
    }
    this.memberNumChart.dispose()
    this.memberNumChart = null
  },
  methods: {
    //获取会员等级列表
    getMemberLevelList(){
      API_Level.levelNameList().then((res=>{
        this.levelList.push({level_name:"全部",level_id:null})
        for (var i = 0; i < res.length; i++){
          this.levelList.push(res[i])
        }
        console.info(this.levelList)
      }))
    },

    //选择会员等级列表
    handleLevelChange(val){
      API_Dashboard.areaCountByLevel({levelId:val}).then((res)=>{
        let list = [...res.data]
        list = list.map(item => {
          const a = {}
          a.name = item.cityName
          a.value = item.recordCount
          return a
        })
        console.info(list)
        //开始绘制
        this.areaCountByLevel(list)
      })
      //获取后调用地图
    },
    //获取各地区会员数据

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
    //填充数据、绘制地图
    areaCountByLevel(data){
      //当各地区差值过大时，导致三个图标会特别大，可以调整一下大小,symbolSize属性的返回值决定了图标大小
      var name_title = "各地区各级别会员分布情况"
        // 参考图：https://www.makeapie.com/editor.html?c=xi5eszo651
        this.memberNumChart = this.$echarts.init(document.getElementById('areaCountByLevel'))
        // 地图类型
        var mapName = 'china'
        const nonezero = []
        data.map(item => {
          if (item.value !== 0) {
            nonezero.push(item)
          }
        })
      const sData = data.sort((a, b) => {
        return b.value - a.value
      })
      var geoCoordMap = {}
      /* 获取地图数据*/
      this.memberNumChart.showLoading()
      var mapFeatures = this.$echarts.getMap(mapName).geoJson.features
      this.memberNumChart.hideLoading()
      mapFeatures.forEach((v) => {
        // 地区名称
        var name = v.properties.name
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp
      })
      //定义转化函数
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
            });
          }
        }
        return res;
      };
      //定义option
      const option = {
        title: {
          text: name_title,
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          //formatter:返回的t即是展示的内容
          formatter: (params) => {
            console.info(params)
            let t = params.name + '会员人数：' + params.value+'人'
            if (params.value.length) {
              t = params.name + '会员人数：' + params.value[2]+'人'
            }
            return t
          }
        },
        visualMap: {
          show: true,
          min: 0,
          max: sData[0].value,
          left: '3%',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true,
          seriesIndex: [1],
          inRange: {
            color: ['#2c669b', '#389deb'] // 蓝绿
          }
        },
        geo: {
          show: true,
          map: mapName,
          zoom: 1.8,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#031525',
              borderColor: '#3B5077'
            },
            emphasis: {
              areaColor: '#2B91B7'
            }
          }
        },
        series: [{
          name: '散点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(data),
          symbolSize: (val) => {
            // 图标最大值设置成50，避免过大导致图形变形
            var  value=val[2]
            if (value>50){
              return 50
            }
             return val[2] / 10
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: 'pink'
            }
          }
        },
          {
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, // 长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: data
          },
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', // 气泡
            symbolSize: (val) => {
              //val[2]取到的改地区数值大小，数值多大的，我做一些调整
              var  value=val[2]
              if (value>50){
                return 50
              }
              return val[2] / 10
            },
            label: {
              normal: {
                formatter: '{@[2]}',
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#F62157' // 标志颜色
              }
            },
            zlevel: 6,
            data: convertData(nonezero)
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(sData.slice(0, 5)),
            symbolSize: (val) => {
              var  value=val[2]
              if (value>50){
                return 50
              }
              return value
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: 'yellow',
                shadowBlur: 10,
                shadowColor: 'yellow'
              }
            },
            zlevel: 1
          }

        ]
      }
      this.memberNumChart.setOption(option)

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

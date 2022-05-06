import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'
import { flushSync } from 'react-dom'
const { Meta } = Card
export default function Home() {
  const [viewList, setViewList] = useState([])

  const [starList, setStarList] = useState([])

  const [visible, setVisible] = useState(false)

  const [pieChart, setPieChart] = useState(null)

  const [allList,setAllList] = useState([])
  //可视化
  const barRef = useRef()
  const pieRef = useRef()

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then((res) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title))

      setAllList(res.data)
      //防止window.resize在其组件也被调用，所以在组件销毁的时候，也销毁resieze
      return () => {
        window.onresize = null
      }
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then((res) => {
      setViewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then((res) => {
      setStarList(res.data)
    })
  }, [])

  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类提示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)

    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = (obj) =>{
    //数据处理
    var currentList = allList.filter(item=>item.author===username)
    var groupObj = _.groupBy(currentList,item=>item.category.title)
 
    var list=[]
    for(var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }

    var myChart;
    if(!pieChart){
      myChart=Echarts.init(pieRef.current)
      setPieChart(myChart)
    }else{
      myChart=pieChart
    }
    var option;

option = {
  title: {
    text: '当前用户新闻图示',
    // subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '发布数量',
      type: 'pie',
      radius: '50%',
      data: list,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

option && myChart.setOption(option);

  }

  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem('token'))

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  flushSync(() => {
                    setVisible(true)
                  })
                  // 初始化
                  renderPieView()
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer title="个人新闻分类" width="500px" placement="right" closable={false} onClose={() => setVisible(false)} visible={visible}>
        <div
          ref={pieRef}
          style={{
            height: '400px',
            width: '100%',
          }}
        ></div>
      </Drawer>

      <div
        ref={barRef}
        style={{
          height: '400px',
          width: '100%',
        }}
      ></div>
    </div>
  )
}

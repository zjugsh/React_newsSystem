import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      // 让首页不可展开
      const list = res.data

      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = ''
        }
      })
      setDataSource(list)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="blue">{key}</Tag>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
                </div>
              }
              title="页面配置项"
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button type="primary" shape="circle" icon={<EditOutlined />} 
              disabled={item.pagepermisson === undefined} 
              style={{marginLeft:'20px'}}/>
            </Popover>
          </div>
        )
      },
    },
  ]

  const switchMethod = (item) => {
    //直接修改dataSource(歪门邪道的方法)
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    //更新json
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    }
  }

  const confirmMethod = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {},
    })
  }

  //删除
  const deleteMethod = (item) => {
    // 当前页面同步 + 后端同步
    // filter不影响原来的datasource原状态
    if (item.grade === 1) {
      //删除父级
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      //通过子集过滤出父级，然后删除，但是filter是浅拷贝，dataSource已经变了
      let list = dataSource.filter((data) => data.id === item.rightId)
      list[0].children = list[0].children.filter((data) => data.id !== item.id)
      console.log(list, dataSource)
      // 这个地方我是真的不懂，因为写dataSource不行，要写成[...dataSource]
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  )
}

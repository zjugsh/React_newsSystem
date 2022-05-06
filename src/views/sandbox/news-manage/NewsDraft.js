import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, notification, } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res) => {
      // 让首页不可展开
      const list = res.data

      setDataSource(list)
    })
  }, [username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',

    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      },
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

            <Button  shape="circle" icon={<EditOutlined />} onClick={()=>{
              props.history.push(`/news-manage/update/${item.id}`)
            }}/>

            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)}/>
          </div>
        )
      },
    },
  ]

  const handleCheck= (id)=>{
    axios.patch(`/news/${id}`,{
       auditState:1
    }).then(
      res=>{
        props.history.push('/audit-manage/list')
        notification.info({
          message: `通知`,
          description:
            `您可以到审核列表中查看您的新闻`,
          placement:'bottomRight',
        });
      }
    )
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
  
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      axios.delete(`/news/${item.id}`)
   
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={item=>item.id}
      />
    </div>
  )
}

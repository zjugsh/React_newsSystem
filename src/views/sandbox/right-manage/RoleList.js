import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentId, setCurrentId] = useState(0)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalVisible(true)
                setCurrentRights(item.rights)
                setCurrentId(item.id)
              }}
              style={{marginLeft:'20px'}}
            />
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    axios.get('/roles').then((res) => {
      setDataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      setRightList(res.data)
    })
  }, [])

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
    axios.delete(`/roles/${item.id}`)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    //同步dataSource
    setDataSource(
      dataSource.map(item => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          }
        }
        return item
      })
    )
    axios.patch(`/roles/${currentId}`,{rights:currentRights})
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  //改变勾选状态
  const onCheck = (checkKeys) => {
    setCurrentRights(checkKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          // defaultCheckedKeys={} 这个是非受控的，只有第一次可以变，要用下面受控的
          checkedKeys={currentRights}
          onCheck={onCheck}
          //父打勾不再关联
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}

import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
// import Item from 'antd/lib/list/Item'
import { flushSync } from 'react-dom'
const { confirm } = Modal

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState(null)
  //forwardRef
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))
  
  useEffect(() => {
    const roleObj = {
      '1':'superadmin',
      '2':'admin',
      '3':'editor'
    }
    axios.get('/users?_expand=role').then((res) => {
      // 让首页不可展开
      const list = res.data
      setDataSource(roleObj[roleId]==='superadmin'?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]==='editor'),
      ])
    })
  }, [roleId,region,username])

  useEffect(() => {
    axios.get('/regions').then((res) => {
      // 让首页不可展开
      const list = res.data
      setRegionList(list)
    })
  }, [])

  useEffect(() => {
    axios.get('/roles').then((res) => {
      // 让首页不可展开
      const list = res.data
      setRoleList(list)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      //table组件中自带过滤功能
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:'全球',
          value:'全球'
        }
      ],
      onFilter:(value,item)=>{
        if(value==='全球'){
          return item.region===''
        }
        return item.region===value
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => confirmMethod(item)} />
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} style={{ marginLeft: '20px' }} onClick={() => handleUpdate(item)} />
          </div>
        )
      },
    },
  ]

  const handleUpdate = (item) => {
  //  setTimeout(() => {
  //    //状态更新不保证同步，所以放在异步中，使得 setIsUpdateVisible(true)和updateForm同步
  //    setIsUpdateVisible(true)
  //    updateForm.current.setFieldsValue(item)
  //  }, 0);

  //react升级到18之后，好像有所改动，状异步同步同步更新好像和以前不一样了（因为不用reactDom.render,而现在用的式 ReactDOM.createRoot，所以settimeout不管用了，只能用下面这个了，具体看我微信！）
  flushSync(() => {
    setIsUpdateVisible(true)
   //写在这边会出现p169第1小时46分钟的问题
    // if(item.roleId===1){
    //   //禁用
    //   setIsUpdateDisabled(true)
    // }else{
    //   setIsUpdateDisabled(false)
    // }
  })
  if(item.roleId===1){
    //禁用
    setIsUpdateDisabled(true)
  }else{
    setIsUpdateDisabled(false)
  }
  updateForm.current.setFieldsValue(item)
  setCurrent(item)
  }

  const handleChange = (item) => {
    //关掉开关之后，此人无法登录了
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    })
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
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  const addFormOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        setIsAddVisible(false)
        addForm.current.resetFields()
        //post 到后端，自动生成id，再设置dataSource，方便后面的删除和更新
        axios
          .post(`/users`, {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ])
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const updateFormOk=()=>{
    updateForm.current.validateFields().then(
      value=>{
        setIsUpdateVisible(false)
        setDataSource(
          dataSource.map(
            item =>{
              if(item.id===current.id){
                return {
                     ...item,
                     ...value,
                     role:roleList.filter(data=>data.id===value.roleId)[0]
                }
              }
              return item
            }
          )
        )
        setIsUpdateDisabled(!isUpdateDisabled)
        axios.patch(`/users/${current.id}`,value)
      }
    )
  }

  return (
    <div>
      <Button type="primary" onClick={() => setIsAddVisible(true)}>
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
         
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} 
        ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}

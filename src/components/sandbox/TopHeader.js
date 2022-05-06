import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
const { Header } = Layout

 function TopHeader(props) {
  
  // const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
   //改变state的isCollapsed
   props.changeCollapsed()
  }
  const {role:{roleName},username} = JSON.parse(localStorage.getItem('token'))
  const menu = (
    <Menu>
      <Menu.Item >
    {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={()=>{
      localStorage.removeItem('token')
      props.history.replace('./login')
      }
      }>
        退出
      </Menu.Item>
    </Menu>
  )
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
      className: 'trigger',
      onClick: this.toggle,
    })} */}
      {
        // 显示组件
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
        <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

// connect(参数一：mapStateToProps;mapDispatchToProps)(参数二：被包装的组件)

const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
  //必须返回一个对象
  return{
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type:'change_collapsed'
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
// export default withRouter(TopHeader)

import React, { useEffect, useState } from 'react'
import { Layout,Menu } from 'antd'
import {
  UserOutlined,
} from '@ant-design/icons';
import './index.css'
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import {connect} from 'react-redux'

const {Sider} = Layout
const {SubMenu} = Menu
// const menuList=[
//   {
//     key:'/home',
//     title:'首页',
//     icon:<UserOutlined/>
//   },
//   {
//     key:'/user-manage',
//     title:'用户管理',
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:'/user-manage/list',
//         title:'用户列表',
//         icon:<UserOutlined/>
//       },
//     ]},
//       {
//         key:'/right-manage',
//         title:'权限管理',
//         icon:<UserOutlined/>,
//         children:[
//           {
//             key:'/right-manage/role/list',
//             title:'角色列表',
//             icon:<UserOutlined/>
//           },
//           {
//             key:'/right-manage/right/list',
//             title:'权限列表',
//             icon:<UserOutlined/>
//         }  
//     ]}
// ]

//地址和图标映射表
const iconList = {
'/home':<UserOutlined/>,
'/user-manage':<UserOutlined/>,
'/right-manage':<UserOutlined/>,
'/user-manage/list':<UserOutlined/>,
'/right-manage/role/list':<UserOutlined/>,
'/right-manage/right/list':<UserOutlined/>
}

 function SideMenu(props) {
  const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
  const checkPagePermission=(item)=>{
    return item.pagepermisson && rights.includes(item.key)
    }
  const renderMenu = (menuList)=>{
    return menuList.map(item=> {
    //?.可选链
      if(item.children?.length>0 && checkPagePermission(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {/* 递归 */}
          {renderMenu(item.children)}
        </SubMenu>
      }
   
      return checkPagePermission(item) && <Menu.Item  key={item.key} icon={iconList[item.key]}
      // 注意：这里之所以能拿到props，是引入了withRouter高阶组件，不引入的话，因为SideMenu不是Route的子组件（login才是），
      // 所以拿不到Route传来的props属性
      onClick={()=>{props.history.push(item.key)}}>{item.title}</Menu.Item> 
    })
  }
  const [menu,setMenu] = useState([])
  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      console.log(res.data);
      setMenu(res.data)
    })
  },[])
  const selectKeys = props.location.pathname

  //截取1级路径
  const openkeys = '/'+props.location.pathname.split('/')[1]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
       {/* 好好看看flex布局 */}
       <div style={{display:'flex',height:'100%',flexDirection:'column'}}>
       <div className="logo" >全球新闻发布管理系统</div>
          <div style={{flex:1,overflow:'auto'}}>
          {/* selectedKeys--受控组件， defaultSelectedKeys--非受控组件 */}
          <Menu theme="dark" mode="inline" selectedKeys={[selectKeys]} className='aaaaaa'
          defaultOpenKeys={[openkeys]}>{renderMenu(menu)}
          </Menu>
          </div>
          
       </div>
          {/* <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['2']}
           
          >
            <Menu.Item key='1' icon={<UserOutlined/>}>
              nav1
              </Menu.Item>

              <SubMenu key='sub4' icon={<SettingOutlined/>} title='Navigation Three'>
              <Menu.Item key='2'>
              nav1
              </Menu.Item>
              <Menu.Item key='3'>
              nav1
              </Menu.Item>
              </SubMenu>
          </Menu> */}
        
          
        </Sider>
  )
}
const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
  //必须返回一个对象
  return{
    isCollapsed
  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))
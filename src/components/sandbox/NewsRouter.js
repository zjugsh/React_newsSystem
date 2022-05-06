import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import { Redirect, Route, Switch } from 'react-router-dom'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import { Spin } from 'antd'
import { connect } from 'react-redux'

function NewsRouter(props) {
  const LocalRouterMap={
    '/home':Home,
    '/user-manage/list':UserList,
    '/right-manage/role/list':RoleList,
    '/right-manage/right/list':RightList,
    '/news-manage/add':NewsAdd,
    '/news-manage/draft':NewsDraft,
    '/news-manage/category':NewsCategory,
    '/news-manage/preview/:id':NewsPreview,
    '/news-manage/update/:id':NewsUpdate,
    '/audit-manage/audit':Audit,
    '/audit-manage/list':AuditList,
    '/publish-manage/unpublished':Unpublished,
    '/publish-manage/published':Published,
    '/publish-manage/sunset':Sunset
  }

    const [backRouteList,setBackRouteList] = useState([])
    useEffect(()=>{
      Promise.all([
        axios.get('/rights'),
        axios.get('/children')
      ]).then(
        res=>setBackRouteList([...res[0].data,...res[1].data])
      )
    },[])

    const checkRoute=(item)=>{
      return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))

    const checkUserPermission=(item)=>{
     return rights.includes(item.key)
    }

  return (
    <Spin size="large" spinning={props.isLoading}>
    <Switch>
   {
     backRouteList.map(
       item=> {
         //要加括号的，因为是调用函数直接return值
         if(checkRoute(item) && checkUserPermission(item)){
         return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact/>
         }
         return null
       }
     )
   }
    <Redirect from='/' to='/home' exact/>
   {
     backRouteList.length>0 && <Route path='*' component={NoPermission} />
   }
  </Switch>
  </Spin>
  )
}


const mapStateToProps=({LoadingReducer:{isLoading}})=>{
  //必须返回一个对象
  return{
    isLoading
  }
}
export default  connect(mapStateToProps)(NewsRouter)
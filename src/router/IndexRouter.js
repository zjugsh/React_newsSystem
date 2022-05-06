import React from 'react'
import { HashRouter, Route,Switch,Redirect } from 'react-router-dom'
import Login from '../views/login/Login'
import NewssandBox from '../views/sandbox/NewssandBox'

export default function IndexRouter() {
  return (
    // 首先，这个路由是5版本的，但现在已经出6版本的了
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        
        <Route path="/" render={()=>
       localStorage.getItem('token')?
      <NewssandBox></NewssandBox>:
      <Redirect to='/login'/> } />
      </Switch>
    </HashRouter>
  )
}

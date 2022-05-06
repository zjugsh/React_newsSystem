import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

//css在上面引入没错，在下面引入就出错
import './NewssandBox.css'
import { Layout } from 'antd'
import NewsRouter from '../../components/sandbox/NewsRouter'
// import { Content } from 'antd/lib/layout/layout'
import NProgress from 'nprogress'
import "nprogress/nprogress.css";

const {Content} =Layout


export default function NewssandBox() {
  NProgress.start()
  useEffect(()=>{NProgress.done()})
  // NProgress.done()注意：不管写不写在一行，只要不加大括号，就是错的，我也不知道啥原因
  //但是箭头函数是可以写在不是同一行的：
  //let function1 = x=>
 //               x*2  是可以的
  
  return (
    <Layout>
      <SideMenu></SideMenu>
     <Layout className='site-layout'>
     <TopHeader></TopHeader>
     <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              overflow:'auto'
            }}
          >
      <NewsRouter/>
      </Content>
     </Layout>
      </Layout>
  )
}

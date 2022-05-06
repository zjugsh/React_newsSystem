import { Button, Form, Input, message } from 'antd'
import React from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import axios from 'axios';


export default function Login(props) {
 const onFinish=(values)=>{
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
      res=>{
        // console.log(res.data);
        if(res.data.length===0){
          message.error('用户名或密码不匹配')
        }else{
          localStorage.setItem('token',JSON.stringify(res.data[0]))
          props.history.push('/')
        }
      }
    )
 }
 const particlesInit = async (main) => {
  await loadFull(main);
};


  return (
    <div style={{background:'rgb(35,39,65)',height:'100%'}}>
     <Particles
      id="tsparticles"
      init={particlesInit}
    
      options={{
        background: {
          color: {
            value: "black",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 6,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
    <div className='formContainer'>
      <div className='loginTitle'>全球新闻发布管理系统</div>
    <Form
      name="normal_login"
      className="login-form"
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Form.Item>
    </Form>
    </div>
    </div>
  )
}

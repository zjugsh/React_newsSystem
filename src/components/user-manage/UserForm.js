import { Form, Input, Select } from 'antd'
import { forwardRef, useEffect, useState } from 'react'
import React from 'react'
import FormItem from 'antd/lib/form/FormItem'
const { Option } = Select

//使用forwardRef反正我没看懂
//学习视频中有的
const UserForm = forwardRef((props, ref) => {
  //选择超级管理员时禁用上面的区域
  const [isDisabled, setisDisabled] = useState(false)
  useEffect(() => {
    setisDisabled(props.isUpdateDisabled)
    //只要[props.isUpdateDisabled]变了，则useEffect又会再执行一遍
  }, [props.isUpdateDisabled])

  const { roleId, region } = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    1: 'superadmin',
    2: 'admin',
    3: 'editor',
  }
  const checkRegionDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return item.value !== region
      }
    }
  }

  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return roleObj[item.id]!=='editor'
      }
    }
  }
  return (
    //弹出的表单
    <Form ref={ref} layout="vertical">
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="region"
        label="区域"
        // 禁用状态则这一项不是必填项
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: 'Please input the title of collection!',
                },
              ]
        }
      >
        <Select disabled={isDisabled}>
          {props.regionList.map((item) => (
            //注意disabled={checkRegionDisabled()}加括号
            <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select
          onChange={(value) => {
            if (value === 1) {
              setisDisabled(true)
              ref.current.setFieldsValue({ region: '' })
            } else {
              setisDisabled(false)
            }
          }}
        >
          {props.roleList.map((item) => (
            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>
              {item.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
})
export default UserForm

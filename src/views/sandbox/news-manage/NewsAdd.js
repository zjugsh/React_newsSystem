import { Button, Form, Input, message, notification, PageHeader, Select, Steps } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import style from './News.module.css'
const { Step } = Steps
const { Option } = Select

export default function NewsAdd(props) {
  useEffect(() => {
    axios.get('./categories').then((res) => {
      setCategoryList(res.data)
    })
  }, [])

  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const NewsForm = useRef(null)
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const User = JSON.parse(localStorage.getItem('token'))

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res)
          setCurrent(current + 1)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不为空')
      } else {
        setCurrent(current + 1)
      }
    }
  }

  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      'content':content,
      'region':User.region?User.region:'全球',
      'author': User.username,
      'roleId': User.roleId,
      'auditState': auditState,
      'publishState': 0,
      'createTime': Date.now(),
      'star': 0,
      'view':0,
      // publishTime:0 ,
    }).then(
      res=>{
        props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
        notification.info({
          message: `通知`,
          description:
            `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
          placement:'bottomRight',
        });
      }
    )
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  return (
    <div>
      <PageHeader className="site-page-header" title="撰写新闻" subTitle="我爱你" />
      <div>
        {' '}
        <Steps current={current}>
          <Step title="基本信息" description="新闻标题，新闻分类" />
          <Step title="新闻内容" description="新闻主题内容" />
          <Step title="新闻提交" description="保存草稿或者提交审核" />
        </Steps>
      </div>

      <div style={{ marginTop: '50px' }}>
        {/* 不能用&&，因为这样字不是隐藏，是销毁，所以input里面输入的值再返回就没有了，所以用display：none */}
        <div className={current === 0 ? '' : style.active}>
          <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} ref={NewsForm}>
            <Form.Item label="新闻标题" name="title" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="新闻分类" name="categoryId" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Select>
                {categoryList.map((item) => {
                  //注意：写大括号的话一定要写return，这俩个是连在一起的
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.title}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor
            getContent={(value) => {
              setContent(value)
            }}
          />
        </div>
        <div className={current === 2 ? '' : style.active}>
          3333
          <input type="text" />
        </div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  )
}

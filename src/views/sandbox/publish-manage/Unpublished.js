
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from './usePublish'

export default function Unpublished() {
  //usePublish自定义hooks，传入1是待发布的
 const {dataSource,handlePublish}= usePublish(1)

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='primary' onClick={()=>handlePublish(id)}>发布</Button>} ></NewsPublish>
    </div>
  )
}


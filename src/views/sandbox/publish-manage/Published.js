
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from './usePublish'

export default function Published() {
  //usePublish自定义hooks，传入2是已发布的
 const {dataSource,handleSunset}= usePublish(2)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='danger' onClick={()=>handleSunset(id)}>下线</Button>} ></NewsPublish>
    </div>
  )
}

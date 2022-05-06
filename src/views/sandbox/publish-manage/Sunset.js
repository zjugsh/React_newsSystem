
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from './usePublish'

export default function Sunset() {
  //usePublish自定义hooks，传入3是已下线的
 const {dataSource,handleDelete}= usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='danger' onClick={()=>handleDelete(id)}>删除</Button>}></NewsPublish>
    </div>
  )
}

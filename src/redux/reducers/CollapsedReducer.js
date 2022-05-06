
//{isCollapsed:false} es6初始化，默认不折叠
export const CollapsedReducer = (prevState={isCollapsed:false},action) =>{

  let {type}=action
  switch(type){
    case "change_collapsed":
    let newstate={...prevState}
    newstate.isCollapsed=!newstate.isCollapsed
    return newstate
    default:
      return prevState
  }

}
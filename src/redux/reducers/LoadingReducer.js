
//{isCollapsed:false} es6初始化，默认不折叠
export const LoadingReducer = (prevState={isLoading:false},action) =>{

  let {type,payload}=action
  switch(type){
    case "change_loading":
    let newstate={...prevState}
    newstate.isLoading=payload
    return newstate
    default:
      return prevState
  }

}
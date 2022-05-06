import {createStore,combineReducers} from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


//reducer很多，用此方法合并
const reducer = combineReducers({
  CollapsedReducer,
  LoadingReducer
})

//持久化 redux-persist
const persistConfig = {
  key:'root',
  storage,
  blacklist:['LoadingReducer']
}
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export {store,persistor}
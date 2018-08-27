import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/index'
import appConf from '../config/appConfig'

const middleWares = []

let store = null

const configureStore = (/*initialState*/) => {
  if (appConf.buildType === 'development') {
    middleWares.push(createLogger())
    console.disableYellowBox = true
  }
  store = createStore(
    rootReducer,
    //initialState,
    //compose(applyMiddleware(...middlewares))
    applyMiddleware(...middleWares)
  )
  return store
}
const getGlobalStore = () => {
  return store
}
export {configureStore, getGlobalStore}

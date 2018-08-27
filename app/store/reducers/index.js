import {combineReducers} from 'redux'
import merge from 'lodash/merge'
import * as appAct from '../actions/app'
import {updateSettings} from '../db'

// 约定 dispatch action 定义为: {action: type, payload: data}
const appInitState = {
  db: {
    authorTang: {min: 0, max: 0},
    authorSong: {min: 0, max: 0},
    poetTang: {min: 0, max: 0},
    poetSong: {min: 0, max: 0},
    shijing: {min: 0, max: 0}
  },
  settings: {
    id: 1,
    fontStyle: 'zh-CHS',
    fontSize: 12,
    theme: '#fff',
    themes: ['#fff', '#d4c396', '#bed0e2', '#c7eac7', '#e0e0e0', '#ffb1a3'],
    nightMode: true,
    readMode: true
  },
  context: {
    init: 0,
    initMsg: '',
    poetId: 0,
    showSearch: false,
    showSettings: false,
    showAuthor: false
  }
}
const app = (state = appInitState, action) => {
  switch (action.type) {
    case appAct.UPDATE_REALM:
      return merge({}, state, action.payload)
    case appAct.UPDATE_SETTINGS:
      state = merge({}, state, action.payload)
      updateSettings(state.settings)
      return state
    case appAct.UPDATE_CONTEXT:
      return merge({}, state, action.payload)
    case appAct.RESET_APPLICATION:
      return appInitState
  }
  return state
}

export default combineReducers({
  app
})

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {configureStore} from './app/store/configureStore'
import Router from './app/Router'
import Orientation from 'react-native-orientation'
import SplashScreen from 'react-native-splash-screen'
import Realm from 'realm'
import rnfs from 'react-native-fs'
import * as schema from './app/store/db/schema'
import * as db from './app/store/db'
import * as appAct from './app/store/actions/app'

const store = configureStore()

export default class App extends Component {

  constructor(props) {
    super(props)
    const poetFile = rnfs.DocumentDirectoryPath + '/poet.realm'
    const userFile = rnfs.DocumentDirectoryPath + '/user.realm'
    this.dbs = []
    rnfs.exists(poetFile).then(exists => {
      if (!exists) {
        Realm.copyBundledRealmFiles()
        store.dispatch(appAct.updateContext({init: 1/6, initMsg: '复制诗词数据库文件到手机'}))
      }
      const r1 = new Realm({
        schema: [
          schema.AuthorTangSchema,
          schema.AuthorSongSchema,
          schema.PoetTangSchema,
          schema.PoetSongSchema,
          schema.ShijingSchema
        ],
        path: poetFile,
        schemaVersion: 1,
        readOnly: true
      })
      this.dbs.push(r1)
      const r2 = new Realm({
        schema: [
          schema.SettingsSchema,
          schema.BookmarkSchema,
          schema.UserSchema,
        ],
        path: userFile,
        schemaVersion: 1,
        readOnly: false
      })
      this.dbs.push(r2)
      db.initRealm(r1, r2)
    }).catch(err => {
      console.error('realm error:' + err)
    })
  }

  componentDidMount() {
    Orientation.lockToPortrait()
    SplashScreen.hide()
  }
  componentWillUnmount() {
    const {context} = store.getState().app
    if (context.poetId > 0) {
      db.updateLastPoetId(context.poetId)
    }
    
    this.dbs.forEach((db => {
      db.close()
    }))
  }
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}

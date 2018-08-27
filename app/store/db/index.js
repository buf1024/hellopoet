import {getGlobalStore} from "../configureStore"
import * as appAct from './../actions/app'

let poetRealm = null
let userRealm = null
let storeObj = null

export const initRealm = (r1, r2) => {
  poetRealm = r1
  userRealm = r2
  let store = getGlobalStore()
  // poet db
  storeObj = {
    authorSong: {min: 0, max: 0},
    authorTang: {min: 0, max: 0},
    poetSong: {min: 0, max: 0},
    poetTang: {min: 0, max: 0},
    shijing: {min: 0, max: 0}
  }

  store.dispatch(appAct.updateContext({init: 2/6, initMsg: '正在初始化诗词作者数据'}))
  let obj = poetRealm.objects('AuthorSong')
  storeObj.authorSong.min = obj.min('id')
  storeObj.authorSong.max = obj.max('id')

  obj = poetRealm.objects('AuthorTang')
  storeObj.authorTang.min = obj.min('id')
  storeObj.authorTang.max = obj.max('id')

  store.dispatch(appAct.updateContext({init: 3/6, initMsg: '正在初始化诗词数据'}))
  obj = poetRealm.objects('PoetSong')
  storeObj.poetSong.min = obj.min('id')
  storeObj.poetSong.max = obj.max('id')

  obj = poetRealm.objects('PoetTang')
  storeObj.poetTang.min = obj.min('id')
  storeObj.poetTang.max = obj.max('id')

  obj = poetRealm.objects('Shijing')
  storeObj.shijing.min = obj.min('id')
  storeObj.shijing.max = obj.max('id')

  store.dispatch(appAct.updateRealm(storeObj))
  // user db
  store.dispatch(appAct.updateContext({init: 4/6, initMsg: '正在初始化用户数据'}))
  obj = userRealm.objects('User')
  if (obj.length === 0) {
    const {app} = store.getState()
    userRealm.write(() => {
      userRealm.create('User', {id: 1, poetId: storeObj.poetTang.min, bookmarks: [], settings: {id: 1, ...app.settings}})
    })
    store.dispatch(appAct.updateContext({poetId: storeObj.poetTang.min}))
    store.dispatch(appAct.updateContext({init: 1, initMsg: '正在加载诗词视图'}))
  } else {
    let settings = {
      id: obj[0].id,
      fontStyle: obj[0].settings.fontStyle,
      fontSize: obj[0].settings.fontSize,
      theme: obj[0].settings.theme,
      themes: [...obj[0].settings.themes],
      nightMode: obj[0].settings.nightMode,
      readMode: obj[0].settings.readMode
    }
    store.dispatch(appAct.updateSettings(settings))
    store.dispatch(appAct.updateContext({poetId: obj[0].poetId}))
    store.dispatch(appAct.updateContext({init: 1, initMsg: '正在诗词加载视图'}))
  }
}

// poet db
const getPoetSchema = (id) => {
  if (poetRealm) {
    if (id >= storeObj.authorSong.min && id <= storeObj.authorSong.max) {
      return 'AuthorSong'
    }
    if (id >= storeObj.authorTang.min && id <= storeObj.authorTang.max) {
      return 'AuthorSong'
    }
    if (id >= storeObj.poetSong.min && id <= storeObj.poetSong.max) {
      return 'PoetSong'
    }
    if (id >= storeObj.poetTang.min && id <= storeObj.poetTang.max) {
      return 'PoetTang'
    }
    if (id >= storeObj.shijing.min && id <= storeObj.shijing.max) {
      return 'Shijing'
    }
    return null
  } else {
    console.log('poetRealm == null')
  }
}
export const getAuthorById = (id) => {
  const schema = getPoetSchema(id)
  if (schema !== 'AuthorSong' && schema !== 'AuthorTang') {
    return null
  }
  let authors = poetRealm.objects(schema).filtered('id = $0', id)
  if (authors.length > 0) {
    return authors[0]
  }
  return null
}

export const getAuthorByPoetIdName = (id, name) => {
  let schema = getPoetSchema(id)
  if (schema !== 'PoetSong' && schema !== 'PoetTang') {
    return null
  }
  if (schema === 'PoetSong') {
    schema = 'AuthorSong'
  } else {
    schema = 'AuthorTang'
  }
  let authors = poetRealm.objects(schema).filtered('name = $0', name)
  let retAuthors = []
  for (let author of authors) {
    retAuthors.push({...author})
  }
  return retAuthors
}
export const getPoetById = (id) => {
  const schema = getPoetSchema(id)
  if (schema !== 'PoetSong' && schema !== 'PoetTang' && schema !== 'Shijing') {
    return null
  }
  let poets = poetRealm.objects(schema).filtered('id = $0', id)
  if (poets.length > 0) {
    return poets[0]
  }
  return null

}
export const getPoetByAuthor = (author, schema, start, end) => {
  let schemas = ['PoetTang', 'PoetSong']
  if (schemas.includes(schema)) {
    schemas = [schema]
  }
  let poets = []
  schemas.forEach(s => {
    let result = poetRealm.objects(s).filtered('author CONTAINS $0', author)
    if (result.length > 0) {
      if (start !== undefined && end !== undefined) {
        result = result.slice(start, end)
      }
      poets.push({type: s, poet: result.length > 0 ? result : []})
    }
  })

  return poets
}
export const getPoetByTitle = (title, schema, start, end) => {
  let schemas = ['PoetTang', 'PoetSong', 'Shijing']
  if (schemas.includes(schema)) {
    schemas = [schema]
  }
  let poets = []
  schemas.forEach(s => {
    let result = poetRealm.objects(s).filtered('title CONTAINS $0', title)
    if (result.length > 0) {
      if (start !== undefined && end !== undefined) {
        result = result.slice(start, end)
      }
      poets.push({type: s, poet: result.length > 0 ? result : []})
    }
  })

  return poets
}
export const getPoetByContent = (content, schema, start, end) => {
  let schemas = ['PoetTang', 'PoetSong', 'Shijing']
  if (schemas.includes(schema)) {
    schemas = [schema]
  }
  let poets = []
  schemas.forEach(s => {
    let result = poetRealm.objects(s).filtered('content CONTAINS $0', content)
    if (result.length > 0) {
      if (start !== undefined && end !== undefined) {
        result = result.slice(start, end)
      }
      poets.push({type: s, poet: result.length > 0 ? result : []})
    }
  })

  return poets
}

// user db
export const getRecentSearch = () => {
  if (userRealm) {
    let objs = userRealm.objects('User')
    if (objs.length > 0) {
      return [...objs[0].recentSearch]
    }
  } else {
    console.error('userRealm == null')
  }
  return []
}
export const setRecentSearch = (recentSearch) => {
  if (userRealm) {
    userRealm.write(() => {
      let objs = userRealm.objects('User')
      for (let o of objs) {
        o.recentSearch = recentSearch
      }
    })
  } else {
    console.error('userRealm == null')
  }
}
export const getBookmarks = (start, end) => {
  if (userRealm) {
    let objs = userRealm.objects('User')
    if (start !== undefined && end !== undefined) {
      let poets = []
      for (let i = start; i < end && i < objs[0].bookmarks.length; i++) {
        const bookmark = objs[0].bookmarks[i]
        poets.push({
          id: bookmark.id,
          title: bookmark.title,
          content: bookmark.content,
          date: bookmark.date
        })
      }
      return poets
    } else {
      if (objs[0].bookmarks.length > 0) {
        return getBookmarks(0, objs[0].bookmarks.length)
      }
    }
  } else {
    console.info('userRealm == null')
  }
  return []
}
export const isBookmark = (poetId) => {
  if (userRealm && poetRealm) {
    let objs = userRealm.objects('User')
    for (let i = 0; i < objs[0].bookmarks.length; i++) {
      const bookmark = objs[0].bookmarks[i]
      if (bookmark.id === poetId) {
        return true
      }
    }
    return false
  } else {
    console.info('userRealm == null')
  }
  return false
}
export const addBookmark = (bookmark) => {
  if (userRealm) {
    userRealm.write(() => {
      let objs = userRealm.objects('User')
      for (let o of objs) {
        o.bookmarks.push(bookmark)
      }
    })
  } else {
    console.error('userRealm == null')
  }
}
export const delBookmark = (id) => {
  if (userRealm) {
    userRealm.write(() => {
      let objs = userRealm.objects('User')
      for (let o of objs) {
        for (let i = 0; i < o.bookmarks.length; i++) {
          if (o.bookmarks[i].id === id) {
            o.bookmarks.splice(i, 1)
            let bookmark = userRealm.objects('Bookmark').filtered('id = $0', id)
            userRealm.delete(bookmark)
            break
          }
        }
      }
    })
  } else {
    console.error('userRealm == null')
  }
}

export const updateSettings = (settings) => {
  if (userRealm) {
    userRealm.write(() => {
      let objs = userRealm.objects('User')
      objs[0].settings = settings
    })
  } else {
    console.error('userRealm == null')
  }
}

export const updateLastPoetId = (poetId) => {
  if (userRealm) {
    userRealm.write(() => {
      let objs = userRealm.objects('User')
      objs[0].poetId = poetId
    })
  } else {
    console.error('userRealm == null')
  }
}


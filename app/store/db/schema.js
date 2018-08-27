export const AuthorTangSchema = {
  name: 'AuthorTang',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    desc: 'string',
  }
}
export const AuthorSongSchema = {
  name: 'AuthorSong',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    desc: 'string',
  }
}
export const PoetTangSchema = {
  name: 'PoetTang',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    content: 'string',
    author: 'string'
  }
}
export const PoetSongSchema = {
  name: 'PoetSong',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    content: 'string',
    author: 'string'
  }
}
export const ShijingSchema = {
  name: 'Shijing',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    content: 'string'
  }
}

export const SettingsSchema = {
  name: 'Settings',
  primaryKey: 'id',
  properties: {
    id: 'int',
    themes: 'string[]',
    fontStyle: 'string',
    fontSize: 'int',
    theme: 'string',
    nightMode: 'bool',
    readMode: 'bool'
  }
}
export const BookmarkSchema = {
  name: 'Bookmark',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    content: 'string',
    date: 'date'
  }
}
export const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'int',
    recentSearch: 'string[]',
    poetId: 'int',
    bookmarks: 'Bookmark[]',
    settings: 'Settings'
  }
}

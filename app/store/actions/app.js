import * as utils from './utils'

export const UPDATE_REALM = 'UPDATE_REALM'
export const updateRealm = (db) => utils.action(UPDATE_REALM, {payload: {db}})

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const updateSettings = (settings) => utils.action(UPDATE_SETTINGS, {payload: {settings}})

export const UPDATE_CONTEXT  = 'UPDATE_CONTEXT'
export const updateContext = (context) => utils.action(UPDATE_CONTEXT, {payload: {context}})

export const RESET_APPLICATION  = 'RESET_APPLICATION'
export const resetApplication = () => utils.action(RESET_APPLICATION, {payload: {}})



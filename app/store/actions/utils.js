export const asyncAction = (base) => {
  return ['REQUEST', 'SUCCESS', 'FAILURE'].reduce((acc, type) => {
    acc[type] = `${base}_${type}`
    return acc
  }, {})
}
export const action = (type, payload) => {
  return {type, ...payload}
}
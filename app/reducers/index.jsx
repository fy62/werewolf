import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  admin: require('./admin').default,
  game: require('./game').default,
})

export default rootReducer

import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import {whoami} from './reducers/auth'
import {fetchUsers, sendMessageAction, updateGameActions, sendVoteAction, addUser, tallyVotes} from './reducers/game'

const store = createStore(rootReducer, applyMiddleware(createLogger(), thunkMiddleware))

export default store

// Set the auth info at start
// store.dispatch(whoami())
// store.dispatch(fetchUsers())



store.dispatch(updateGameActions())

// store.dispatch(sendMessageAction('emily', 'whats the error'))

store.dispatch(tallyVotes())








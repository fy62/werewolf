import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import {whoami} from './reducers/auth'
import {fetchUsers, updateGameActions} from './reducers/game'

import Moderator from './moderator/moderator'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(
	applyMiddleware(createLogger(), thunkMiddleware)
))

export default store

/*
Reducer currently listening and sending to "wrong" place on firebase.
React component views still depend on data being in these "wrong" spots.
*/

// fetches whoAmI, but you're always Bobette
store.dispatch(whoami())
// fetches fake users, fills out the playerList
//store.dispatch(fetchUsers())
// fetches fake messages, fills out ChatBox
store.dispatch(updateGameActions())


/*---------
Try out the moderator below by directly invoking its methods below.
Empty out 'testinggame' key in db and uncomment up to desired section
Refresh browser and checkout what happens in firebase in realtime

Later on, these methods should/will be indirectly invoked by players
sending all their redux actions to "PlayerActions" with the correct action.type
----------*/

/*// GAME START, ROLE ASSIGN, GAME LOOP

// create a new game with name, your name, and your uid
const mod = new Moderator('testgame', 'felicia', 1);
mod.handleJoin({name: 'felicia', uid: 1});

// friends join the game
mod.handleJoin({name: 'jenny', uid: 2});
mod.handleJoin({name: 'garity', uid: 3});
mod.handleJoin({name: 'gladys', uid: 4});
mod.handleJoin({name: 'ashi', uid: 5});
mod.handleJoin({name: 'galen', uid: 6});

// ~something happens~ (needs to be some button or command)
// roles assigned and wait for leader to say /ready after this
mod.handleStart();

// leader said /ready. game loop begins.
mod.handleLeaderStart();*/



/*// THE FIRST NIGHT, WEREWOLVES, PRIEST, SEER

setTimeout(() => {

  // werewolves vote on kill
  mod.handleVote({user: 'gladys', vote: 'galen'})
  mod.handleVote({user: 'garity', vote: 'galen'})

  // villagers also voting on kill.... just demonstration
  mod.handleVote({user: 'ashi', vote: 'jenny'})
  mod.handleVote({user: 'felicia', vote: 'jenny'})
  mod.handleVote({user: 'galen', vote: 'jenny'})

  // other night actions -- seer and priest
  // toggle priest action to see that jenny can either die or be saved

  mod.handleScry({user: 'felicia', role: 'seer', target: 'garity'})
  //mod.handleSave({user: 'jenny', role: 'priest', target: 'jenny'})
}, 6000)
*/

/*// THE FIRST DAY, VILLAGERS VOTE

setTimeout(() => {
  mod.handleVote({user: 'felicia', vote: 'jenny'})
  mod.handleVote({user: 'garity', vote: 'jenny'})
  mod.handleVote({user: 'gladys', vote: 'galen'})
  mod.handleVote({user: 'garity', vote: 'galen'})
  mod.handleVote({user: 'gladys', vote: 'galen'})
  mod.handleVote({user: 'ashi', vote: 'jenny'})
  mod.handleScry({user: 'felicia', role: 'seer', target: 'garity'})
  mod.handleSave({user: 'jenny', role: 'priest', target: 'jenny'})

}, 12000)

*/

// store.dispatch(tallyVotes())

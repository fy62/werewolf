import { browserHistory } from 'react-router';
import Moderator from '../moderator/moderator';

// export let gameId;
// const playerActions = `games/${gameId}/playerActions/`;
// const storeActions = `games/${gameId}/storeActions/`;

let mod;

const initialState = {
  gameId: '',
  gameStart: false,
  player: {},
  // users: { [playerName: String]: User }
  users: {},

  day: true,
  messages: [],
}

//TODOS

// startGame actions
// listen to /werewolf after roles are assigned

/* ------------       REDUCER     ------------------ */


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECIEVE_GAMEID:
      return {...state, gameId: action.gameId}

    case SET_PLAYER:
      return {...state, player: action.player}

    case UPDATE_PLAYER:
      return {
        ...state,
        player: {...state.player, joined: true, ...action.updates},
      }

    case RECIEVE_USER:
      return {
        ...state,
        users: {
          ...state.users,
          [action.name]: {
            name: action.name,
            uid: action.uid,
            alive: true,
            color: action.color,
            role: action.role
          },
        },
      }

    case UPDATE_USER:
      return {
        ...state,
        users: {
          ...state.users,
          [action.name]: {
            ...state.users[action.name],
            ...action.updates,
          },
        },
        player: action.name === state.player.name ? {
          ...state.player,
          ...action.updates,
        } : player,
      }

    case RECIEVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, {text: action.message, user: action.user}],
      }

    case SWITCH_TIME:
      return {
        ...state,
        day: action.timeofday === 'daytime',
      }

    default:
      return state
  }
}

/* -----------------    ACTIONS     ------------------ */

const ADD_GAMEID = 'ADD_GAMEID';
const RECIEVE_GAMEID = 'RECIEVE_GAMEID';
const START_GAME = 'START_GAME';
const LEADER_START = 'LEADER_START';

const SET_PLAYER = 'SET_PLAYER';
const UPDATE_PLAYER = 'UPDATE_PLAYER'
const ADD_USER = 'ADD_USER';
const UPDATE_USER = 'UPDATE_USER';
const RECIEVE_USER = 'RECIEVE_USER';

const RECIEVE_MESSAGE = 'RECIEVE_MESSAGE';
const RECIEVE_VOTE = 'RECIEVE_VOTE';
const SWITCH_TIME = 'SWITCH_TIME';

const SCRYING = 'SCRYING';
const SAVING = 'SAVING';
const KILLING = 'KILLING';

/* ------------     ACTION CREATORS     ------------------ */

export const setPlayer = player => ({
  type: SET_PLAYER, player
})

export const updatePlayer = (updates) => ({
  type: UPDATE_PLAYER, updates
})

export const getAllUsers = users => ({
  type: GET_USERS, users
})

export const firebaseUpdate = update => {
  return update;
}

export const recieveGameId = gameId => ({
  type: RECIEVE_GAMEID, gameId
})

/*---------
Listeners for /storeActions
the moderator listens for playeractions and dispences storeactions
----------*/


// Generic Action Listener, will RECEIVE actions whenever firebase/actions updates in /public /:uid
export const updateGameActions = () => {
  return (dispatch, getState) => {
    const storeActions = `games/${getState().game.gameId}/storeActions/`;

    firebase.database().ref(`${storeActions}/public`).on('child_added', function(action){
      dispatch(firebaseUpdate(action.val()))
    })

    firebase.database().ref(`${storeActions}/${getState().game.player.uid}`).on('child_added', function(action){
      if (action.val().type === 'UPDATE_USER' && action.val().role === 'werewolf'){
        dispatch(updateWolfActions())
      }
      dispatch(firebaseUpdate(action.val()))
    })
  }
}

// after roles are assigned, call this dispatcher!!!
// Action Listener for werewolves
export const updateWolfActions = (gameId) => {
  return (dispatch, getState) => {
    const storeActions = `games/${gameId}/storeActions/`;
    if (getState().game.player.role === "werewolf") {
      firebase.database().ref(`${storeActions}/werewolves`).on('child_added', function(action){
        dispatch(firebaseUpdate(action.val()))
      })
    }
  }
}

/* ------------       DISPATCHERS     ------------------ */

// in util.js
// Helper function to wrap actions and send them to firebase
const gameAction =
  actionCreator =>
  (...args) => (dispatch, getState) => {
    const {gameId} = getState().game
    const playerActions = firebase.database().ref(`games/${gameId}/playerActions`)
    const action = actionCreator(...args)
    return playerActions.push(action)
  }

/*---------
Game SetUp Actions
----------*/

// called in chat onEnter grabs gameId from url and places on local store
export const setGameId = (gameId) => {
  return dispatch => {
    dispatch(recieveGameId(gameId));
  }
}

// dispatched when Game Leader puts in Player name and clicks "Start Game"
// sets gameId on players state
// dispatches addUser
// instantiates new Moderator
// redirects to game chatroom
export const createNewGame = (name, gameName, uid) => {
  return (dispatch, getState) => {
    const uid = getState().game.player.uid;
    const username = name.toLowerCase();
    const gameId = firebase.database().ref('games').push({
      name: gameName
    });
    gameId.then(() =>  {
      dispatch(setGameId(gameId.key));
      dispatch(updatePlayer({leader: true}));
      dispatch(joinGame(username, gameId.key));
      mod = new Moderator(gameId.key, username, uid)
      browserHistory.push(`/game/${gameId.key}`)
    });
  }
}

// When player joins a created game we update state.game.player.joined to TRUE
// and we add the player to everyones Users object
export const joinGame = (name, gameId) => {
  return (dispatch, getState) => {
    const uid = getState().game.player.uid;
    const username = name.toLowerCase();
    dispatch(addUser(username, uid, gameId));
    dispatch(updatePlayer({name: username}));
    dispatch(updateGameActions(gameId));
  }
}

// when user joins a game they input a Player name.
export const addUser = gameAction(
  (username, uid, gameId) => ({
    type: ADD_USER,
    name: username,
    uid: uid
  })
)

export const startGame = gameAction(
  () => ({
    type: START_GAME,
  })
)

export const leaderStart = gameAction(
  () => ({
    type: LEADER_START,
  })
)

 /*---------
Game Player Actions
----------*/

// send messages to playerActions
export const sendMessageAction = gameAction(
  (user, message, role) => ({
    type: RECIEVE_MESSAGE,
    user,
    message,
    role,
  })
)

// send votes to playerActions
export const sendVoteAction = gameAction (
  (user, target) => ({
      type: RECIEVE_VOTE,
      user,
      target
    })
)

// send scrys to playerActions
export const sendScryAction = gameAction (
  (user, target) => ({
      type: SCRYING,
      user,
      target
    })
)

// send saves to playerActions
export const sendSaveAction = gameAction (
  (user, target) => ({
    type: SAVING,
    user,
    target
  })
)

/* ------------------  default export     ------------------ */

export default reducer;


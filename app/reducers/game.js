import { browserHistory } from 'react-router';

const game = 'modmerge test';

const initialState = {
  gameId: null,
  self: {},
  users: {},

  day: true,
  votes: [],

// message arrays
  villager: [],
  wolf: [],
  seer: [],
  priest: [],
}

const playerActions = `games/${game}/playerActions/`;
const storeActions = `games/${game}/storeActions/`;

//TODOS
// do we want to delay daytime voting?
// night ends when time is up or all night players have completed their actions
// day ends when  majority vote has been reached or maybe also time is up

/* ------------       REDUCER     ------------------ */

const reducer = (state = initialState, action) => {

  const newState = Object.assign({}, state)

  switch (action.type) {

    case ADD_GAMEID:
    // console.log("inside switch, ", action.gameId);
      newState.gameId = action.gameId;
      break;

    case SET_SELF:
      newState.self = action.self;
      break;

    case ADD_USER:
      newState.users[action.uid] = {
        name: action.name,
        alive: true,
        color: action.color,
        role: action.role
      }
      break;

    case UPDATE_USER:
      // do we need to object assign everything here?
      if (action.name === newState.self.name) {
        newState.self.role = action.role;
      }
      newState.users[action.name].role = action.role;
      break;

    case RECIEVE_MESSAGE:
      let msg = {
        text: action.message,
        user: action.user,
      }
      newState[action.role] = [...newState[action.role], msg]
      break;

    case RECIEVE_VOTE:
      let vote = {
        killUser: action.vote,
        user: action.user
      }
      newState.votes = [...newState.votes, vote];
      break;

    case KILLING:
      state.users[action.uid].alive = false;
      newState.users = Object.assign({}, state.users)
      break;

    case SWITCH_TIME:
      if (action.timeofday === 'daytime'){
        newState.day = true;
      } else if (action.timeofday === 'nighttime') {
        newState.day = false;
      }
      newState.votes = [];
      newState.villager = [];
      newState.seer = [];
      newState.priest = [];
      newState.wolf = [];
      break;

    default:
      break;
  }

  return newState;
}

/* -----------------    ACTIONS     ------------------ */

const ADD_GAMEID = 'ADD_GAMEID';

const SET_SELF = 'SET_SELF';
const ADD_USER = 'ADD_USER';
const UPDATE_USER = 'UPDATE_USER';

const RECIEVE_MESSAGE = 'RECIEVE_MESSAGE';
const RECIEVE_VOTE = 'RECIEVE_VOTE';
const SWITCH_TIME = 'SWITCH_TIME';

const SCRYING = 'SCRYING';
const SAVING = 'SAVING';
const KILLING = 'KILLING';

/* ------------     ACTION CREATORS     ------------------ */
// export const recieveMessage = message => ({
//   type: RECIEVE_MESSAGE,
//   message
// })

// export const recieveVote = vote => ({
//   type: RECIEVE_VOTE, vote
// })

export const setSelf = self => ({
  type: SET_SELF, self
})

export const getAllUsers = users => ({
  type: GET_USERS, users
})

export const firebaseUpdate = update => {
  return update;
}

/* ------------       DISPATCHERS     ------------------ */

/*---------
The following two functions create the new spaces in the database for the game
the moderator is then made to listen for playeractions and dispence storeactions

We may want to move this logic later??????
----------*/

export const setGameId = (gameId) => {
  return dispatch => {
    // console.log("inside setGameId ", gameId)
    firebase.database().ref(`games/${gameId}/playerActions`).push({
      type: ADD_GAMEID,
      gameId
    })
    .catch(console.error);
  }
}

export const createNewGame = (userName, gameName, uid) => {
  return dispatch => {
    // console.log("creating new game with ", userName, gameName);
    // Pushes a new game into firebase, the random key is returned and saved as gameId
    const gameId = firebase.database().ref('games').push({
      name: gameName
    });
    // TODO adds game leader to users on State => not sure if this should be on state.game or state.moderator
    // .then(() => addUser(userName, null))
    // TODO need to call new Moderator
    // TODO gameId not currently updating on state
    gameId.then(() =>  {
      dispatch(setGameId(gameId.key));
      // let mod = new Moderator(gameId, userName, uid)
      browserHistory.push(`/chat/${gameId.key}`)
    });
  }
}

/*---------
The previous two functions create the new spaces in the database for the game
the moderator is then made to listen for playeractions and dispence storeactions
----------*/


// Generic Action Listener, will recieve actions whenever firebase/actions updates
export const updateGameActions = () => {
  return (dispatch, getState) => {
// <<<<<<< HEAD
//     const gameId = getState().game.gameId;
//     firebase.database().ref(`games/${gameId}/playerActions`).on('child_added', function(action){
//       console.log('recieved action from firebase ', action)
// =======
    firebase.database().ref(`${storeActions}/public`).on('child_added', function(action){
        dispatch(firebaseUpdate(action.val()))
    })

    firebase.database().ref(`${storeActions}/${getState().game.self.uid}`).on('child_added', function(action){
        dispatch(firebaseUpdate(action.val()))
    })
  }
}

// after roles are assigned, call this dispatcher!!!
export const updateWolfActions = () => {
  return (dispatch, getState) => {
    if (getState().game.self.role === "werewolf") {
      firebase.database().ref(`${storeActions}/werewolves`).on('child_added', function(action){
        dispatch(firebaseUpdate(action.val()))
      })
    }
  }
}

// send messages as player actions
export const sendMessageAction = (user, message, role) => {
  return dispatch => {
    firebase.database().ref(playerActions).push({
      type: RECIEVE_MESSAGE,
      user: user,
      message: message,
      role: role,
    })
    .then(res => {
      // console.log('message sent to firebase')
    })
    .catch(err => console.error('Error sending message to firebase', err))
  }
}

// send votes as player actions
export const sendVoteAction = (user, vote) => {
  return dispatch => {
    firebase.database().ref(playerActions).push({
      type: RECIEVE_VOTE,
      user: user,
      vote: vote
    })
    .catch(err => console.error('Error getting the lastest votes from firebase', err))
  }
}

// send scrys as player actions
export const sendScryAction = (user, target) => {
  return (dispatch, getState) => {
    dispatch(sendMessageAction(user.name, `/peek ${target}`, 'seer'));
    firebase.database().ref(playerActions).push({
      type: SCRYING,
      user,
      target
    })
  }
}

// send saves as player actions
export const sendSaveAction = (user, target) => {
  return (dispatch, getState) => {
    dispatch(sendMessageAction(user.name, `/save ${target}`, 'seer'));
    firebase.database().ref(playerActions).push({
      type: SAVING,
      user,
      target
    })
  }
}

/* ------------------  default export     ------------------ */

export default reducer;


/* NOT SURE IF WE NEED THIS STUFF OR NOT ANYMORE

// export const fetchUsers = () => {
//   return dispatch => {
//     firebase.database().ref('/users/').once('value')
//     .then(res => {
//       dispatch(getAllUsers(res.val()))
//      })
//     .catch(console.error)
//   }
// }

// // when user joins a game they input a username. Users are stored by username in the db
// export const addUser = (username) => {
//   return dispatch => {
//     firebase.database().ref(`games/${gameId}/playerActions`).push({
//       type: ADD_USER,
//       role,
//       alive,
//       won,
//       uid,
//       color,
//     })
//     .catch(console.error)
//   }
// }

// // dispatched after a majority vote is reached
// export const sendSwitchTimeAction = (timeofday) => {
//   return dispatch => {
//     firebase.database().ref(playerActions).push({
//     type: SWITCH_TIME,
//     timeofday,
//     })
//     .catch(err => console.error('Error getting the lastest timeofday from firebase', err))
//   }
// }

// // dispatched after a majority vote is reached
// export const sendKillUserAction = (user) => {
//   return dispatch => {
//     firebase.database().ref(playerActions).push({
//     type: KILLING,
//     user
//     })
//     .catch(err => console.error('Error getting the lastest killUser from firebase', err))
//   }
// }

// // dispatched if a majority vote is not reached
// // might have to turn into a moderator message
// export const sendAddTallyAction = (tally) => {
//   return dispatch => {
//     firebase.database().ref(playerActions).push({
//     type: ADD_TALLY,
//     tally,
//     })
//     .catch(err => console.error('Error getting the lastest addTally from firebase', err))
//   }
// }

// // tallys votes. Kills user if majority is reached, otherwise tally is added to store
// export const tallyVotes = () => {
//   return (dispatch, getState) => {
//     const {votes, users, day} = getState().game;
//     const tally = {};
//     votes.forEach(vote => {
//       const killUser = vote.killUser;
//       if (!tally[killUser]) {
//         tally[killUser] = 0;
//       }
//       tally[killUser] += 1;
//     })

//     let maxVotes = 0;
//     let maxUser;
//     Object.keys(tally).forEach(key => {
//       if (tally[key] > maxVotes) {
//         maxUser = key;
//         maxVotes = tally[key];
//       }
//     })
//     const numOfPlayers = Object.keys(users).length;
//     if(maxVotes > numOfPlayers / 2) {
//       dispatch(sendKillUserAction(maxUser));
//       dispatch(sendSwitchTimeAction(day ? 'nighttime' : 'daytime'))
//     }
//     else dispatch(sendAddTallyAction(tally));
//   }
// }

// // helper function for assigning roles, for moderator use
// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {

//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }

*/

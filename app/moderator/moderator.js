/*
  actions
  settings -- use this to toggle options for testing
  moderator class
    constructor / official game state
    functions
  helper function
*/

/* -----------------    ACTIONS     ------------------ */

const RECIEVE_MESSAGE = 'RECIEVE_MESSAGE';
const RECIEVE_VOTE = 'RECIEVE_VOTE';
const PROMPT_LEADER = 'PROMPT_LEADER';
const START_GAME = 'START_GAME';
const LEADER_START = 'LEADER_START';
const GAME_LOOPING = 'GAME_LOOPING';
const ADD_USER = 'ADD_USER';
const UPDATE_USER = 'UPDATE_USER';
const SCRYING = 'SCRYING';
const SAVING = 'SAVING';
const KILLING = 'KILLING';
const ADD_GAMEID = 'ADD_GAMEID';
const RECIEVE_USER = 'RECIEVE_USER';

/* ----------------- SETTINGS ------------------ */

/*

line 596 needs to be commented back in if you want to stop less than5 player games

*/

let colors =
[
  'chocolate','brown', 'darkred', 'crimson', 'firebrick', 'orangered',
  'darkorange', 'orange', 'darkgoldenrod', 'goldenrod', 'gold',
  'yellow', 'lawngreen', 'seagreen', 'darkgreen', 'darkolivegreen',
  'darkcyan', 'darkturquoise', 'cadetblue', 'deepskyblue', 'darkblue',
  'midnightblue', 'darkslateblue', 'blueviolet', 'indigo',  'rebeccapurple',
  'purple', 'darkmagenta', 'plum', 'violet', 'lightcoral', 'darksalmon',
  'darkslategrey',
];

let avatars = [
 'f01', 'm01',
 'f02', 'm02',
 'f03', 'm03',
 'f04', 'm04',
 'f05', 'm05',
 'f06', 'm06',
 'f07', 'm07',
 'f08', 'm08',
 'f09', 'm09',
 'f10', 'm10',
 'f11', 'm11',
 'f12', 'm12',
 'f13', 'm13',
 'f14', 'm14',
 'f15', 'm15',
]

// milliseconds for various setTimeouts

const timeToRead = 2000;  // 2 sec
const timeForNight = 60000; // 60 sec
const timeForDay = 120000; // 2 min


// shuffle: helper function, used for assigning roles
// IF YOU COMMENT THIS OUT THEN THE ROLES ARE:
// player 1 seer, player 2 priest,
// the next werewolves, and remaining villagers

const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/* ----------------- THE MODERATOR ------------------ */

/*
the moderator class is the ultimate source of truth: its props reflect the game state at every given point

players send actions to "PlayerActions" on firebase
the moderator listens to that key and as the only person listening to all player events,
mod logically adjusts the props, and responds to "StoreActions"

players do NOT listen to "PlayerActions"! players only listen to assigned channels on "StoreActions"
they only change what mod has told them to change, which may be "personal" private state changes OR public, simultaneous changes for everyone
*/

/* -------------- currently... --------------- */

/*
a new instance of the moderator class should be invoked by the leader who initiates a game chat room
the leader then commands "/ready", triggering the moderator's assignment of roles and the game loop
*/

/* -------------- eventually... --------------- */
// the moderator is run on another server and the leader is not the one invoking the methods


export default class Moderator {
  // created when a leader creates a game

  constructor(gameName, leaderName, uid) {

    this.gameName = gameName;
    this.gameId = '';
    this.leaderId = uid;

    // the order of join corresponds to the index of random color and avatar
    // i.e. leader, the first join, gets 0th color and 0th avatar

    this.colors = shuffle(colors);
    this.avatars = shuffle(avatars);

    this.players = [];
    this.playerNames = [];
    this.wolfNames = [];
    this.didAssign = false; // roles have been assigned
    this.inGameLoop = false; // leader confirmed /ready and night began
    this.seerId = '';
    this.priestId = '';

    this.votes = [];
    this.majority = false;
    this.day = true;
    this.dayNum = 0;
    this.dayTimers = [];
    this.nightTimers = [];
    this.didScry = false; // seer action once per night
    this.didSave = false; // priest action once per night
    this.chosen = ''; // chosen to die that day/night

    this.winner = ''; // winner is string, villagers or werewolves

    // Listen to player existential crises in Firebase
    const roster = firebase.database().ref(`games/${this.gameName}/roster`)

    roster.on('child_added', person =>
      this.narrate(`Welcome, ${person.val()}.`, 'public'))
    roster.on('child_removed', person =>
      this.narrate(`${person.val()} fell down a well.`))

    // listen to player actions in firebase
    firebase.database().ref(`games/${this.gameName}/playerActions/`)
    .on('child_added', (action) => {
      if (action.val().moderated) return
      action.ref.update({moderated: true})

      const playerAction = action.val();

      switch (playerAction.type) {

        case ADD_USER:
          this.handleJoin(playerAction)
          break;


        case PROMPT_LEADER:
          this.handlePromptLeader()
          break;

        case START_GAME:
          this.handleStart()
          break;

        case ADD_GAMEID:
          this.handleGameId()
          break;

        case LEADER_START:
          this.handleLeaderStart()
          break;

        case RECIEVE_MESSAGE:
          this.moderate(playerAction, playerAction.role, 'msg')
          break;

        case RECIEVE_VOTE:
          this.handleVote(playerAction)
          break;

        case SCRYING:
          this.handleScry(playerAction)
          break;

        case SAVING:
          this.handleSave(playerAction)
          break;

        default:
          break;
      }
    })

  }

/* --------------------- Main Moderator Functionality ------------------ */

  // moderator narration function, takes in message text
  // and sends RECIEVE_MESSAGE object to firebase
  // typeof: message = string,
  // role = role, in a string,
  // personal = specific uid or 'werewolves' (leave null to send to everyone)
  // error = 1-2 word summary of msg (leave null for generic error)
  // fontColor used to color diff moderator messages
  narrate(message, role='public', personal=false, fontColor='none', error=null) {
    let ref = personal ? personal : 'public';
    console.log('inside narrate, color = ', fontColor);
    firebase.database().ref(`games/${this.gameName}/storeActions/${ref}`)
    .push({
      type: RECIEVE_MESSAGE,
      user: 'moderator',
      message: `${message}`,
      role: `${role}`,
      color: fontColor,
    })
    .catch(err => console.error(`Error: moderator sending ${error} message to firebase`, err))
  }

  // moderate function -- more general form of narrate. for every other action.
  // typeof: action = object that has type and any other info,
  // ref = the address in storeActions, in a string,
  moderate(action, ref, error) {
    let channel = ref ? ref : 'public'
    firebase.database().ref(`games/${this.gameName}/storeActions/${channel}`)
    .push(action)
    .catch(err => console.error(`Error: moderator sending ${error} action to firebase`, err))
  }

/* --------------------- Creating/Starting/Joining Game  ------------------------- */

  handleGameId(gameId) {
    firebase.database.ref(`games/${this.gameName}/storeActions/public`).push({
      type: RECIEVE_GAMEID,
      gameId
    })
  }



  // Players have their roles. When players are ready Game Leader can type /ready and play begins
  handleLeaderStart() {
    if (this.didAssign && !this.inGameLoop) {
      // switch from array to object
      const obj = {};
      this.players.forEach(player => obj[player.name] = player);
      this.players = obj;

      // first night time is triggered
      this.nightActions();

      // game has officially started, update folks so they may use their commands
      this.inGameLoop = true;
      this.moderate({type: GAME_LOOPING})
    }
  }



  // Game Leader enters /roles - this assigns player roles
  handleStart() {
    if (this.didAssign) return;
    else if (this.players.length < 5) {
      this.narrate('You need a minimum 5 players to start.', 'public', 'public', '/roles')
      // return;
    }

    const length = this.players.length;
    let numWerewolves = Math.floor(length / 3);
    let roles = ['seer', 'priest'];
    while (numWerewolves--) roles.push('werewolf');
    while (roles.length < length) roles.push('villager');
    roles = shuffle(roles);

    this.players.forEach((player, index) => {
      player.role = roles[index];
      if (player.role === 'seer') this.seerId = player.uid;
      if (player.role === 'priest') this.priestId = player.uid;
      if (player.role === 'werewolf') this.wolfNames.push(player.name);
    });

    const werewolves = this.players.filter(player => (player.role === 'werewolf'));
    const wwToFirebase = werewolves.map(player => (
      {
        type: UPDATE_USER,
        name: player.name,
        updates: {
          role: player.role,
        }
      }
    ));
    const others = this.players.filter(player => (player.role !== 'werewolf'));

    // send werewolf roles to all werewolves
    for (let i = 0; i < werewolves.length; i++) {
      for (let j = 0; j < werewolves.length; j++) {
        this.moderate(wwToFirebase[i], werewolves[j].uid, 'sending wolf role')
      }
    }

    // send one role to everyone else
    others.forEach((player, index) => {
      this.moderate({
        type: UPDATE_USER,
        name: player.name,
        updates: {
          role: player.role,
        }
      }, player.uid, 'sending role')
    })

    // send messages to all players informing them of their role
    this.players.forEach((player, index) => {
      if (player.role === 'seer') {
        let msg = `You are a SEER. As a seer, you can learn the identity of one player each night.`
        this.narrate(msg, 'public', player.uid, 'rgba(13,122,88, .5)', 'seer role');
      }
      else if (player.role === 'priest') {
        let msg = `You are a PRIEST. As the priest, you can protect one player from the werewolves each night. You can save yourself or another player.`
        this.narrate(msg, 'public', player.uid, 'rgba(13,122,88, .5)', 'priest role');
      }
      else if (player.role === 'werewolf') {
        let msg = `You are a WEREWOLF. As a werewolf, you will vote to slay one villager each night. During the day, you pretend to be an innocent villager.`
        this.narrate(msg, 'wolf', player.uid, 'rgba(13,122,88, .5)', 'werewolf role');
      }
      else if (player.role === 'villager') {
        let msg = `You are a VILLAGER. As a villager, you will deduce which of your fellow villagers is a werewolf in disguise and vote to execute them.`
        this.narrate(msg, 'public', player.uid, 'rgba(13,122,88, .5)', 'werewolf role');
      }
      let msg = `${player.name}, the leader will start the game when everyone is ready.
I will private message you instructions as necessary.
Type '/help' to ask me for help`
      this.narrate(msg, 'public', player.uid, 'role assign');
    })

    // After a timeout, tell leader to use slash command /ready to start
    setTimeout(()=>{
      let msg = `LEADER: When everyone is ready, please type '/ready' to begin the game.`
      this.narrate(msg, 'public', this.leaderId, 'rgba(13,122,88, .5)', 'leader ready');
    }, timeToRead)


    // switch didAssign to true
    this.didAssign = true;

    // update  game.didStart in firebase to true
    const game = firebase.database().ref(`games/${this.gameName}`)
    game.update({didStart:true})
  }


  handleJoin(playerAction) {

    let i = this.players.length;
    this.players.push(
      {
        uid: playerAction.uid,
        name: playerAction.name,

        color: this.colors[i],
        avatar: this.avatars[i],

        alive: true,
        immunity: false,
        // moderator has not determined roles
      }
    );
    this.playerNames.push(playerAction.name);

    let player = {
      type: RECIEVE_USER,

      uid: playerAction.uid,
      name: playerAction.name,

      color: this.colors[i],
      avatar: this.avatars[i],

      alive: true,
      role: 'villager' //everyone is "villager" at first
    }
    this.moderate(player, 'public', 'adduser')
  }

/* --------------------- Msgs To Players  ------------------------- */

  handlePromptLeader() {
    let msg = `When all players are present, type '/roles' to assign roles to everyone. Players cannot join after roles have been assigned.`
    this.narrate(msg, 'public', this.leaderId, 'rgba(13,122,88, .5)', 'prompt leader');
  }


  handleScry(playerAction) {
    const sender = this.players[playerAction.user.name];

    if ((playerAction.user.uid === this.seerId) && !this.day) {
      if (this.players[playerAction.target]) {
        let scry = {
          type: RECIEVE_MESSAGE,
          user: sender.name,
          message: `/scry ${playerAction.target}`,
          role: sender.role,
        }
        this.moderate(scry, this.seerId, 'scrying')

        if (this.didScry) {

          let msg = 'You have already exhausted your mystical powers for tonight. Go to bed and try again tomorrow.'
          this.narrate(msg, sender.role, sender.uid, 'already scryed')

        } else {

          this.didScry = true;
          let werewolfStatus = this.players[playerAction.target].role === 'werewolf';
          let msg = werewolfStatus ? `${playerAction.target} definitely howls at the moon` : `${playerAction.target} wouldn't hurt a fly`
          this.narrate(msg, sender.role, sender.uid, 'scry results')

          if (this.majority && this.didSave) {
            setTimeout(() => {
              clearTimeout(this.nightTimers[this.dayNum])
              this.dayActions();
            }, 5000);
          }
        }
      } else {
        let msg = `${playerAction.target} is not a resident of this village... Did you mean to scry on someone else?`;
        this.narrate(msg, sender.role, sender.uid, 'bad name scryed');
      }
    }
  }

  handleSave(playerAction) {
    const sender = this.players[playerAction.user.name];

    if (playerAction.user.uid === this.priestId && !this.day) {
      if (this.players[playerAction.target]) {
        let save = {
          type: RECIEVE_MESSAGE,
          user: sender.name,
          message: `/save ${playerAction.target}`,
          role: sender.role,
        }
        this.moderate(save, this.priestId, 'saving')

        if (this.didSave) {
          let msg = 'You have already exhausted your holy powers for tonight. Go to bed and try again tomorrow.'

          this.narrate(msg, sender.role, sender.uid, 'already saved')

        } else {
          this.didSave = true;
          this.players[playerAction.target].immunity = true;

          let msg = `A divine shield surrounds ${playerAction.target}, protecting them from the werewolves for tonight.`

          this.narrate(msg, sender.role, sender.uid, 'saving')

          if (this.majority && this.didScry) {
            setTimeout(() => {
              clearTimeout(this.nightTimers[this.dayNum])
              this.dayActions();
            }, 5000);
          }
        }
      } else {
        let msg = `${playerAction.target} is not a resident of this village.... Did you mean to save someone else?`;
        this.narrate(msg, sender.role, sender.uid, 'bad name saved');
      }
    }
  }

// unlike save and scry, playerAction ONLY contains straight up NAMES for voting
  handleVote(playerAction) {
    const sender = this.players[playerAction.user];
    let role = this.day ? 'public' : 'wolf';

    // ignore votes for users that dont exist, send message eventually
    if (!this.players[playerAction.target]){
      let msg = `${playerAction.target} is not a resident of this village.... Did you mean to vote on someone else?`;
      this.narrate(msg, sender.role, sender.uid, 'bad name voted');
      return;
    }

    if (this.players[playerAction.target].alive){
      if (!this.majority) {
        this.votes.push(playerAction);

        let channel = this.day ? 'public' : 'werewolves';
        let methodOfMurder = this.day ? 'execute' : 'maul';

        let msg = `${playerAction.user} votes to ${methodOfMurder} ${playerAction.target}`
        this.narrate(msg, role, channel, `${role} voting`)

        this.tallyVotes(role, methodOfMurder);
        if (this.majority && (this.day || (this.didScry && this.didSave))) {
          setTimeout(() => {
            const dayornight = (this.day) ? 'day' : 'night';
            clearTimeout(this[`${dayornight}Timers`][this.dayNum])
            if (this.day) this.executeActions();
            else this.dayActions();
          }, 5000);
        }
      }
    }

    else {
      let msg = `${playerAction.vote} is already dead.`
      this.narrate(msg, role, this.players[playerAction.user].uid, 'role')
    }
  }

/* ----------- Game Logic: Vote Tally, Day/Night, Killing Players, Game Over --------------- */

  tallyVotes(role, methodOfMurder) {
    const voters = (methodOfMurder === 'maul') ? this.wolfNames : this.playerNames;

    const tally = {};
    voters.forEach(name => {
      tally[name] = {};
    })
    this.votes.forEach(vote => {
      tally[vote.user][vote.target] = true;
    })

    const voteCount = {};
    Object.keys(tally).forEach(voter => {
      Object.keys(tally[voter]).forEach(vote => {
        if (!voteCount[vote]) {
          voteCount[vote] = 0;
        }
        voteCount[vote]++;
      })
    })

    let maxVotes = 0;
    let maxUser = [];
    const keys = Object.keys(voteCount);
    for (let i = 0; i < keys.length; i++) {
      if (voteCount[keys[i]] > maxVotes) {
        // if majority is reached, immediately return
        if (voteCount[keys[i]] > (voters.length / 2)) {
          this.chosen = keys[i];
          this.majority = true;
          let channel = this.day ? 'public' : 'werewolves';
          let msg = `A majority vote has been reached to ${methodOfMurder} ${keys[i]}.  Any votes given after this will not affect the decision.`
          this.narrate(msg, role, channel, role);
          return;
        }
        maxUser = [keys[i]];
        maxVotes = voteCount[keys[i]];
      }
      else if (voteCount[keys[i]] === maxVotes) {
        maxUser.push(keys[i]);
      }
    }

    this.chosen = maxUser[Math.floor(Math.random()*maxUser.length)];
  }

  // called once day resumes
  resolveNightEvents(){
    // should be called after night ends to take immmunity into account
    let chosen = this.players[this.chosen];
    let msg;
    if (!chosen || chosen.immunity){
      msg = `All is well within the village. But werewolves still lurk in the darkness... Gossip with your neighbors about who you think the werewolf is.`
      if (chosen) chosen.immunity = false;
      this.narrate(msg, 'public', null, 'morning');
    }
    else {
      chosen.alive = false;
      this.playerNames.splice(this.playerNames.indexOf(this.chosen), 1);
      if (chosen.role === 'werewolf') this.wolfNames.splice(this.playerNames.indexOf(this.chosen), 1);
      let kill = {
      type: UPDATE_USER,
      name: chosen.name,
      updates: {
          alive: false
        }
      }
      this.moderate(kill, 'public', 'death');
      msg = `${this.chosen} was eaten by werewolves last night! Gossip with your neighbors about who you think the werewolf is.`;
      // red msg background
      this.narrate(msg, 'public', null, 'rgba(110,3,0, .8)', 'morning');
    }

    // once news of the night has been absorbed, call the village to action
    // has green msg background
    setTimeout(()=>{
      let msg2 = ` ALL: Vote to put a suspect to death by typing '/VOTE NAME'. You may vote multiple times. Votes will be publicly announced.`;
      this.narrate(msg2, 'public', null, 'rgba(13,122,88, .5)', 'morning');
    }, timeToRead)

    //resetting the night props
    this.chosen = null;
    this.didScry = false;
    this.didSave = false;
    this.majority = false;
    this.votes = [];
  }

  nightActions() {
    const dayNum = this.dayNum;
    this.narrate(`Everyone in the village goes to sleep.`, 'public')

    // settimeout gives people a chance for people to read and night to switch before messages go out...
      setTimeout(() => {
        this.day = false;
        let timeswitch = {
          type: 'SWITCH_TIME',
          timeofday: 'nighttime'
        }
        this.moderate(timeswitch, 'public', 'night time')

      }, timeToRead);

      setTimeout(() => {
        // send messages to special people
        let wmsg = `Werewolves, awaken. Choose a villager to slay. `
        this.narrate(wmsg, 'wolf', 'werewolves', 'awaken wolves');
        let wmsg2 = `WEREWOLVES: To vote to slay a villager, type '/VOTE NAME'. You must agree on a single target.`
        this.narrate(wmsg2, 'wolf', 'werewolves', 'rgba(54,4,87, .5)', 'awaken wolves');

        let smsg = `Seer, awaken. Choose a player whose identity you wish to discover. You can only discover one player's identity each night.`
        this.narrate(smsg, 'seer', this.seerId, 'awaken seer');
        let smsg2 = `SEER: To check if a certain villager is a werewolf, type '/SCRY NAME'.`;
        this.narrate(smsg2, 'seer', this.seerId, 'rgba(54,4,87, .5)', 'awaken seer');

        let pmsg = `Priest, awaken. Choose a player to save. You are allowed to save yourself or another player. You may only save once per night.`
        this.narrate(pmsg, 'priest', this.priestId, 'awaken priest');
        let pmsg2 = `PRIEST: To protect a villager from death by werewolves, type '/SAVE NAME'`;
        this.narrate(pmsg2, 'priest', this.priestId, 'rgba(54,4,87, .5)', 'awaken priest');

      }, timeToRead * 2) // ... bad way to line up the settimeouts, i know

      this.nightTimers[dayNum] = setTimeout(() => {
        this.dayActions();
      }, timeForNight)
  }

  dayActions() {
    this.day = true;
    const dayNum = ++this.dayNum;
    let timeswitch = {
      type: 'SWITCH_TIME',
      timeofday: 'daytime'
    }
    this.moderate(timeswitch, 'public', 'day time')
    this.narrate(`The sun rises. A new day begins for the village.`, 'public')
    this.resolveNightEvents();

    //werewolves may have won at this point
    this.checkWin();
    if (this.winner === 'werewolves'){
      let msg = `Werewolves have overrun your village and there is no hope for the innocent.`
      this.narrate(msg, 'public', null, 'wolf win')
    }

    else {
      // settimeout for daytime discussions
      this.dayTimers[dayNum] = setTimeout(() => {
        this.executeActions();
      }, timeForDay)
    }
  }

  executeActions() {
    let chosen = this.players[this.chosen];
    if (this.chosen) chosen.alive = false;
    this.playerNames.splice(this.playerNames.indexOf(this.chosen), 1);
    if (chosen.role === 'werewolf') this.wolfNames.splice(this.playerNames.indexOf(this.chosen), 1);

    let msg = `The villagers find ${this.chosen} extremely suspiscious and hang them at townsquare before sundown.`
    this.narrate(msg, 'public', null, 'execution')

    let kill = {
      type: UPDATE_USER,
      name: chosen.name,
      updates: {
          alive: false
        }
    }
    this.moderate(kill, 'public', 'death')
    this.checkWin();

    if (this.winner === 'werewolves'){
      msg = `The village chose to kill a fellow villager... Werewolves have overrun your village and there is no hope for the innocent.`
      this.narrate(msg, 'public', null, 'wolf win')
    }
    else if (this.winner === 'villagers'){
      msg = `The last werewolf has been killed! You have exterminated all the werewolves from your village and can sleep peacefully now.`
      this.narrate(msg, 'public', null, 'village win')
    } else {

      this.chosen = null;
      this.votes = [];
      this.majority = false;

      this.nightActions();
    }
  }
  checkWin(){
    let werewolfCount = 0;
    let villagerCount = 0;

    Object.keys(this.players).forEach((player) => {
      if (this.players[player].role === 'werewolf' && this.players[player].alive){
        werewolfCount++;
      }
      if (this.players[player].role !== 'werewolf' && this.players[player].alive){
        villagerCount++;
      }
    })

    if (werewolfCount === 0) {
      this.winner = 'villagers';
    }
    else if (werewolfCount >= villagerCount){
      this.winner = 'werewolves';
    }
  }

}

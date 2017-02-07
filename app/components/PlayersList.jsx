import React from 'react';
// expects players, user, and day from props
// villager, werewolf, seer, doctor, ... cupid, lovers, hunter, mayor

const PlayersList = (props) => {
  const day = props.day;
  const user = props.user;

  const pickColor = (player, user, day) => {
    if ((user.role === "werewolf") && (player.role === "werewolf") || (!user.alive && (player.role === "werewolf"))) return "thistle";
    if ((!user.night && !day) || ((user.night && !day) && (player.role !== user.role))) return "lightgrey";
    else return "white";
  }

  const dead = (player) => {
    if (!player.alive) return "line-through";
    else return null;
  }

  const getIcon = (player, user) => {
    if (((!user.alive) || (user.role === "doctor")) && (player.role === "doctor")) return <Healing/>;
    else if (((!user.alive) || (user.role === "seer")) && (player.role === "seer")) return <Eye/>;
    else return null;
  }

  return (
    <div className='players-list'>
      {
        Object.keys(players).map((player, index) => {
          return (
            <div className='players' key={index}>

              <div className='avatar'>
                <img src='http://vignette1.wikia.nocookie.net/thesimsmedieval/images/3/3f/Margery-face.jpg/revision/latest?cb=20110630213058' />
              </div>

              <div className='player-name'>
                {player}
              </div>

            </div>
          )
        })
      }
    </div>
  )
}


export default PlayersList;



 /*// id={players[player].uid}
 //  key={index}
 //  primaryText={player}
 //  color={pickColor(players[player], user, day)}
 //  dead={dead(players[player])}

// leftIcon={getIcon(player, user)}
// leftCheckbox={(((player === user.name) || !players[player].alive) || !user.alive) ? null :<Checkbox iconStyle={{fill: "#6E0300"}}/>}
// insetChildren={true}

style={{
            backgroundColor: props.color,
            textDecoration:  props.dead,
            fontFamily: 'IM Fell English SC, serif'*/

const players = {
   bobette :{  // live werewolf
    name: "Bobette",
    role: "villager",
    alive: true,
    immunity: false,
    night: true
  },
   notbob :{  // live seer
    name: "NotBob",
    role: "seer",
    alive: true,
    immunity: false,
    night: true
  },
   rob :{  // live villager
    name: "Rob",
    role: "villager",
    alive: true,
    immunity: false,
    night: false
  },
   roberta :{  // dead villager
    name: "Roberta",
    role: "villager",
    alive: false,
    immunity: false,
    night: false
  },
  jenny : {
    name: "Roberta",
    role: "villager",
    alive: false,
    immunity: false,
    night: false
  }
}

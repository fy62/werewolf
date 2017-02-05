import React from 'react';
import Paper from 'material-ui/Paper';

const Rules = () => {
  return (
    <div className="rules-container">
      <Paper className="rules-paper">
        <h1 className="rules-header">The Rules of the Game</h1>
        <div className="grid">
          <div className="row">
            <div className="col-4">
              <h2>Starting a Game</h2>
            </div>
            <div className="col-8">
              <p>To start a new game, go on <a href="/home">Start Game</a> and enter your username and enter a name for the game. This starts a chat room where you can see who else is playing or who else wants to join the game. In order to start a game, you need at least six players and the person who is initiating the game must click on the Start Game button. Each game will have at least 1 Seer, 1 Doctor, and 2 werewolves, and the rest of the players will be Villagers. Each player should keep their role a secret from other players. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>Gameplay</h2>
            </div>
            <div className="col-8">
              <p>The game proceeds in alternating night and day rounds. It begins with nighttime.</p>
              <h3> The Night</h3>
              <p> At night, the werewolves chat with one another and choose one villager to kill. Each werewolf will vote for their victim by typing "/vote VictimName". The werewolves must unanimously agree on a single victim. There will be a limit on how long they can deliberate.</p><br />

              <p>Next, the Doctor selects someone they'd like to heal. The person chosen (which could be the Doctor himself) will survive if the werewolves had chosen to kill them. If someone was killed, and then saved by the Doctor, the moderator will let the village know by saying, "Someone has been saved", at the beginning of day time.</p><br />

              <p>At the same time, the Seer can ask if a particular player is a werewolf, and the moderator will answer.</p><br/>

              <h3>The Day</h3>
              <p>At the beginning of each day, the moderator announces the username of the player who has been killed, or that nobody died that night. That person is out of the game. They do not reveal their role.</p><br/>

              <p>All the living players in the village and decide whom to lynch. There are no restrictions on speech. Any living player can say anything they want -- truth, misdirection, nonsense, or a barefaced lie. Dead players may not speak at all. Similarly, as soon as a majority of players decide on whom to lynch, that player is dead and out of the game. If an accused party wants to protest, they must do so before the vote goes through. Once a player is lynched, night falls and the cycle repeats. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>Winning</h2>
            </div>
            <div className="col-8">
              <p>The game continues until the number of living werewolves is equal to the number of surviving villagers, or all wolves are dead. If the former occurs, the wolves win. If the latter happens, the villagers win.  </p>
            </div>
          </div>
        </div>
        <h1 className="formHeader">Roles</h1>
        <div className="grid">
          <div className="row">
            <div className="col-4">
              <h2>The Villagers</h2>
            </div>
            <div className="col-8">
              <p>The villagers' role is to try to figure out who the werewolves are. This requires the ability to sense when a player is lying. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>The Werewolves</h2>
            </div>
            <div className="col-8">
              <p>The werewolves' role involves lying throughout the duration of the game to cover their tracks, pretending to be normal villagers. They must convince the villagers of their innocence. At the same time, they have to choose which villager to slay next. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>The Seer</h2>
            </div>
            <div className="col-8">
              <p>The seer is a villager who has the ability to ask the moderator whether or not a  player is a werewolf each night. The seer does this by typing "/peek PlayerName". </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>The Doctor</h2>
            </div>
            <div className="col-8">
              <p>The doctor is a villager who can choose one player to save each night. The player who is chosen cannot be killed that night. The doctor saves a player by typing "/save PlayerName". </p>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default Rules;



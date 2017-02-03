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
              <h2>Setting Up</h2>
            </div>
            <div className="col-8">
              <p>If you want to start a new game, go on <a href="/home">Start Game</a> and enter your username and enter a name for the game. This starts a chat room where you can see who else is playing or who else wants to join the game. In order to start a game, you need at least six players and the person who is initiating the game must click on the Start Game button. Each game will have at least 1 Seer, 1 Doctor, and 2 werewolves, and the rest of the players will be Villagers. Each player should keep their role a secret from other players. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>Gameplay</h2>
            </div>
            <div className="col-8">
              <p>The game proceeds in alternating night and day rounds. It will begin with nighttime.</p>
              <h3> The Night</h3>
              <p> At night, the werewolves will chat with one another and choose one villager to kill. Each werewolf will vote for their victim by typing "/vote VictimName". The werewolves must unanimously agree on a single victim. There will be a limit on how long they can deliberate.</p><br />

              <p>Now, the Doctor selects someone they'd like to heal. The person chosen (which could be the Doctor himself) will survive if the werewolves had chosen to kill them. If someone was killed, and then saved by the Doctor, the moderator will let the village know by saying, "Someone has been saved", at the beginning of day time.</p><br />

              <p>At the same time, the Seer can ask if a particular player is a werewolf, and the moderator will answer.</p><br/>

              <p>Next, a new day begins and the moderator announces the username of the player who has been killed. That person is out of the game. They do not reveal their role.</p><br/>

              <h3>The Day</h3>
              <p>For the first day, go around and have everyone introduce themselves (Example: Hey, I'm Matt. I'm the baker here in town, and I'm a villager.

Daytime is very simple; all the living players gather in the village and decide who to lynch. As soon as a majority of players vote for a particular player to lynch, the moderator says "Ok, you're dead."

Alternative rule:  To keep the game moving along, you can put a time limit to how long a day is, and if the village doesn't chose someone to lynch, they miss the opportunity.

There are no restrictions on speech. Any living player can say anything they want -- truth, misdirection, nonsense, or a barefaced lie. Dead players may not speak at all. Similarly, as soon as a majority vote indicates that a player has been lynched, they are dead. If they want to protest his innocence or reveal some information (like the seer's visions), they must to do it before the vote goes through.

Once a player is lynched, night falls and the cycle repeats. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>Winning</h2>
            </div>
            <div className="col-8">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies nisl ex, ac tempus augue rutrum ac. Donec suscipit quam vel aliquet pretium. Phasellus cursus libero in augue pretium, a venenatis justo sagittis. Nam eget leo eget sapien lobortis rhoncus et in lacus. </p>
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
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies nisl ex, ac tempus augue rutrum ac. Donec suscipit quam vel aliquet pretium. Phasellus cursus libero in augue pretium, a venenatis justo sagittis. Nam eget leo eget sapien lobortis rhoncus et in lacus. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>The Werewolves</h2>
            </div>
            <div className="col-8">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies nisl ex, ac tempus augue rutrum ac. Donec suscipit quam vel aliquet pretium. Phasellus cursus libero in augue pretium, a venenatis justo sagittis. Nam eget leo eget sapien lobortis rhoncus et in lacus. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>The Seer</h2>
            </div>
            <div className="col-8">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies nisl ex, ac tempus augue rutrum ac. Donec suscipit quam vel aliquet pretium. Phasellus cursus libero in augue pretium, a venenatis justo sagittis. Nam eget leo eget sapien lobortis rhoncus et in lacus. </p>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-4">
              <h2>The Doctor</h2>
            </div>
            <div className="col-8">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies nisl ex, ac tempus augue rutrum ac. Donec suscipit quam vel aliquet pretium. Phasellus cursus libero in augue pretium, a venenatis justo sagittis. Nam eget leo eget sapien lobortis rhoncus et in lacus. </p>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default Rules;



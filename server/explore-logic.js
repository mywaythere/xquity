const MAP_LENGTH = 500;
const INITIAL_RADIUS = 20;
const MAX_PLAYER_SIZE = 200;
const FOOD_SIZE = 2;
const EDIBLE_RANGE_RATIO = 0.9;
const EDIBLE_SIZE_RATIO = 0.9;
const usericons = ["Angle", "Bear", "Blue", "Cat", "Girl", "Mywaythere","Pika"]; // usericons to use for players

/** Utils! */

/** Helper to generate a random integer */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

/** Helper to generate a random position on the map */
const getRandomPosition = () => {
  return {
    x: getRandomInt(0, MAP_LENGTH),
    y: getRandomInt(0, MAP_LENGTH),
  };
};

let playersEaten = []; // A list of ids of any players that have just been eaten!

/** Helper to compute when player 1 tries to eat player 2 */
const playerAttemptEatPlayer = (pid1, pid2) => {
  const player1Position = exploreState.players[pid1].position;
  const player2Position = exploreState.players[pid2].position;
  const x1 = player1Position.x;
  const y1 = player1Position.y;
  const x2 = player2Position.x;
  const y2 = player2Position.y;
  const dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  if (dist < exploreState.players[pid1].radius * EDIBLE_RANGE_RATIO) {
    // player 2 is within player 1's eat range
    if (exploreState.players[pid1].radius * EDIBLE_SIZE_RATIO > exploreState.players[pid2].radius) {
      // player 1 is big enough to eat player 2
      exploreState.players[pid1].radius += exploreState.players[pid2].radius;
      playersEaten.push(pid2);
    }
  }
};

/** Attempts all pairwise eating between players */
const computePlayersEatPlayers = () => {
  if (Object.keys(exploreState.players).length >= 2) {
    Object.keys(exploreState.players).forEach((pid1) => {
      Object.keys(exploreState.players).forEach((pid2) => {
        playerAttemptEatPlayer(pid1, pid2);
      });
    });
  }
  // Remove players who have been eaten
  playersEaten.forEach((playerid) => {
    removePlayer(playerid);
  });
  playersEaten = []; // Reset players that have just been eaten
};

/** Helper to check a player eating a piece of food */
const playerAttemptEatFood = (pid1, f) => {
  const player1Position = exploreState.players[pid1].position;
  const foodPosition = f.position;
  const x1 = player1Position.x;
  const y1 = player1Position.y;
  const x2 = foodPosition.x;
  const y2 = foodPosition.y;
  const dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  if (dist < exploreState.players[pid1].radius - FOOD_SIZE) {
    // food is within player 1's eat range
    if (exploreState.players[pid1].radius > FOOD_SIZE) {
      // player 1 is big enough to eat food
      exploreState.players[pid1].radius += FOOD_SIZE;
      removeFood(f);
    }
  }
};

/** Attempts all pairwise eating between each player and all foods */
const computePlayersEatFoods = () => {
  Object.keys(exploreState.players).forEach((pid1) => {
    exploreState.food.forEach((f) => {
      playerAttemptEatFood(pid1, f);
    });
  });
};

/** Explore state */
const exploreState = {
  winner: null,
  players: {},
  food: [],
};

/** Explore logic */

/** Adds a player to the explore state, initialized with a random location */
const spawnPlayer = (id) => {
  exploreState.players[id] = {
    position: getRandomPosition(),
    radius: INITIAL_RADIUS,
    color: usericons[Math.floor(Math.random() * usericons.length)],
  };
};

/** Adds a food to the explore state, initialized with a random location */
const spawnFood = () => {
  exploreState.food.push({
    position: getRandomPosition(),
    radius: FOOD_SIZE,
    color: usericons[Math.floor(Math.random() * usericons.length)],
  });
};

/** Moves a player based off the sent data from the "move" socket msg */
const movePlayer = (id, dir) => {
  // Unbounded moves
  // if (dir === "up") {
  //   exploreState.players[id].position.y += 10;
  // } else if (dir === "down") {
  //   exploreState.players[id].position.y -= 10;
  // } else if (dir === "left") {
  //   exploreState.players[id].position.x -= 10;
  // } else if (dir === "right") {
  //   exploreState.players[id].position.x += 10;
  // }

  // If player doesn't exist, don't move anything
  if (exploreState.players[id] == undefined) {
    return;
  }

  // Initialize a desired position to move to
  const desiredPosition = {
    x: exploreState.players[id].position.x,
    y: exploreState.players[id].position.y,
  };

  // Calculate desired position
  if (dir === "up") {
    desiredPosition.y += 10;
  } else if (dir === "down") {
    desiredPosition.y -= 10;
  } else if (dir === "left") {
    desiredPosition.x -= 10;
  } else if (dir === "right") {
    desiredPosition.x += 10;
  }

  // Keep player in bounds
  if (desiredPosition.x > MAP_LENGTH) {
    desiredPosition.x = MAP_LENGTH;
  }
  if (desiredPosition.x < 0) {
    desiredPosition.x = 0;
  }
  if (desiredPosition.y > MAP_LENGTH) {
    desiredPosition.y = MAP_LENGTH;
  }
  if (desiredPosition.y < 0) {
    desiredPosition.y = 0;
  }

  // Move player
  exploreState.players[id].position = desiredPosition;
};

/** Spawn a food if there are less than 10 foods */
const checkEnoughFoods = () => {
  if (exploreState.food.length < 10) {
    spawnFood();
  }
};

/** Check win condition */
const checkWin = () => {
  const winners = Object.keys(exploreState.players).filter((key) => {
    // check if player is sufficiently large
    const player = exploreState.players[key];
    if (player.radius > MAX_PLAYER_SIZE) {
      return true;
    }
  });

  // WARNING: race condition here; if players' radii become >200 at the same time, explore will keep going
  if (winners.length === 1) {
    exploreState.winner = winners[0];
    Object.keys(exploreState.players).forEach((key) => {
      // remove all players from the explore (effectively resetting the explore)
      removePlayer(key);
    });
  }
};

/** Update the explore state. This function is called once per server tick. */
const updateExploreState = () => {
  checkWin();
  computePlayersEatPlayers();
  computePlayersEatFoods();
  checkEnoughFoods();
};

/** Remove a player from the explore state if they disconnect or if they get eaten */
const removePlayer = (id) => {
  if (exploreState.players[id] != undefined) {
    delete exploreState.players[id];
  }
};

/** Remove a food from the explore state if it gets eaten, given reference to food object */
const removeFood = (f) => {
  let ix = exploreState.food.indexOf(f);
  if (ix !== -1) {
    exploreState.food.splice(ix, 1);
  }
};

const resetWinner = () => {
  exploreState.winner = null;
};

module.exports = {
  exploreState,
  spawnPlayer,
  movePlayer,
  removePlayer,
  updateExploreState,
  resetWinner,
};

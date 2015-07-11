var Player = function() {
  this.x = 50;
  this.y = 50;
  this.r = 20;
  this.collided = false;
};

Player.prototype.getX = function() {
  return this.x; 
};

Player.prototype.getY = function() {
  return this.y;
};

Player.prototype.getR = function() {
  return this.r;
};

Player.prototype.setX = function(x) {
  //check if this.x is greater than the game board
  // if it is then set it at the edge of the board
  if (x >= gameOptions.width) {
    x = gameOptions.width - gameOptions.padding;
  } 
  if (x <= 0) {
    x = gameOptions.padding;
  }

  this.x = x;
};

Player.prototype.setY = function(y) {
  if (y >= gameOptions.height) {
    y = gameOptions.height - gameOptions.padding;
  }
  if (y <= 0) {
    y = gameOptions.padding;
  }

  this.y = y;
};
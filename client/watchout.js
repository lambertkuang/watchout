// start slingin' some d3 here.
var gameOptions = {
  height: 700,
  width: 1000,
  nEnemies: 30,
  padding: 50 
}

var gameStats = {
  score: 0,
  bestScore: 0
}

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height]) 
}

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

var Player = function() {
  this.x = 50;
  this.y = 50;
  this.r = 20;
  this.collided = false;
};

// var Enemies = function() {
//   this.x = Math.random() * 100;
//   this.y = Math.random() * 100;
// }


var player1 = new Player();
var enemies = [];

for (var i = 0; i < gameOptions.nEnemies; i++) {
  enemies.push({
    id: i,
    x: Math.random() * 1000,
    y: Math.random() * 700
  });
}

function update() {
  d3.select('svg').selectAll('circle').data(enemies)
  .transition().duration(1000)
  .attr('cx', function(d) {
    var tempX = Math.random() * 1000;
    return checkX(tempX);
  })
  .attr('cy', function(d) {
    var tempY = Math.random() * 700;
    return checkY(tempY);
  }).attr('class', function(d) {
    return d.id;
  })
  .attr('r', 20);
};

function checkX(x) {
  if (x < 0) {
    x = gameOptions.padding;
  } else if (x > gameOptions.width){
    x = gameOptions.width - gameOptions.padding;
  }
  return x;
};

function checkY(y) {
  if (y < 0) {
    y = 0;
  } else if (y > gameOptions.height){
    y = gameOptions.height - gameOptions.padding;
  }
  return y;
};

function collide() {
  // radiusSum = player1.getR
  var collided = false;
  enemies.forEach(function(enemy) {
    var radiusSum = parseFloat(20) + player1.getR();
    // console.log(d3.select('svg').selectAll('circle').attr('class'))
    var xDiff = parseFloat(d3.select('svg').selectAll('circle').attr('cx')) - player1.getX();
    var yDiff = parseFloat(d3.select('svg').selectAll('circle').attr('cy')) - player1.getY();

    var sep = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (sep < radiusSum) {
      collided = true;
    }
  });
  return collided;    
} 


setInterval(update, 1000);
setInterval(function() {
  if (!collide()) {
    gameStats.score++;
  } else {
    gameStats.score = 0;
  }

  $('.current').find('span').text(gameStats.score);
}, 100);

// Place enemies and players on game board
d3.select('svg').selectAll('svg').data(enemies).enter().append('circle')
  .attr('cx', function(d) {
    return checkX(d.x);
  })
  .attr('cy', function(d) {
    return checkY(d.y);
  })
  .attr('r', 20);


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

// Player.prototype.transform = function(coordinate) {
//   this.setX(coordinate.x);
//   this.setY(coordinate.y); 
// };

// draws the player
d3.select('svg').append('circle').attr('class', 'player').attr('cx', player1.getX()).attr('cy', player1.getY()).attr('r', player1.getR()).attr('fill', 'red');

var drag = d3.behavior.drag().on("drag", function(d, i) {
  d.x += d3.event.dx;
  d.y += d3.event.dy;
  d3.select(this).attr("transform", function(d,i) {
    return "translate(" + [d.x,d.y] + ")";
  });
});

d3.select('.player').data([{"x":player1.getX(), "y":player1.getY()}]).call(drag);



// start slingin' some d3 here.
var gameOptions = {
  height: 700,
  width: 1000,
  nEnemies: 30,
  padding: 50 
}

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
}

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height]) 
}

var gameBoard = d3.select('.container').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

// create enemies
var enemies = [];

for (var i = 0; i < gameOptions.nEnemies; i++) {
  enemies.push({
    id: i,
    x: Math.random() * 1000,
    y: Math.random() * 700
  });
}

var player1 = new Player();

var checkX = function(x) {
  if (x < 0) {
    x = gameOptions.padding;
  } else if (x > gameOptions.width){
    x = gameOptions.width - gameOptions.padding;
  }
  return x;
};

var checkY = function(y) {
  if (y < 0) {
    y = 0;
  } else if (y > gameOptions.height){
    y = gameOptions.height - gameOptions.padding;
  }
  return y;
};

var collide = function() {
  var collided = false;

  enemies.forEach(function(enemy) {
    var radiusSum = parseFloat(20) + player1.getR();
    var xDiff = parseFloat(d3.select(enemy)[0][0].x) - player1.getX();
    var yDiff = parseFloat(d3.select(enemy)[0][0].y) - player1.getY();
    var sep = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (sep < radiusSum) {
      collided = true;
    }
  });

  
  if (!collided) {
    gameStats.score++;
    if (gameStats.score >= gameStats.bestScore) {
      gameStats.bestScore++;
    }
  } else {
    gameStats.score = 0;
    gameStats.collisions++;
  }

  // return collided;    
} 

// var detectCollisions = function() {
//   var collision = false;
//   d3.select(enemies).each(function() {
//     var radSum = 40;
//     var x = this.x - player1.x;
//     var y = this.y - player1.y;
//     if (Math.sqrt(x*x + y*y) < radSum) {
//       collision = true;
//     }
//   });
//   if (collision) {
//     gameStats.score = 0;
//     gameStats.collisions++;
//   } else {
//     gameStats.score++;
//     if (gameStats.score >= gameStats.bestScore) {
//       gameStats.bestScore++;
//     }
//   }
//   $('.current').find('span').text(gameStats.score);
//   $('.collisions').find('span').text(gameStats.collisions);
//   $('.high').find('span').text(gameStats.bestScore);
// };

// d3.timer(detectCollisions);

var update = function() {
  d3.select('svg').selectAll('circle').data(enemies)
  .transition()
  .duration(1000)
  .attr('cx', function(d) {
    var tempX = Math.random() * 1000;
    d.x = checkX(tempX);
    return checkX(tempX);
  })
  .attr('cy', function(d) {
    var tempY = Math.random() * 700;
    d.y = checkY(tempY);
    return checkY(tempY);
  }).attr('class', function(d) {
    return d.id;
  })
  .attr('r', 20);

};

// Place enemies and players on game board
d3.select('svg').selectAll('svg').data(enemies).enter().append('circle')
  .attr('cx', function(d) {
    return checkX(d.x);
  })
  .attr('cy', function(d) {
    return checkY(d.y);
  })
  .attr('r', 20);

// d3.timer(update);
setInterval(update, 1000);
setInterval(function() {
  // if (!collide()) {
  //   gameStats.score++;
  //   if (gameStats.score >= gameStats.bestScore) {
  //     gameStats.bestScore++;
  //   }
  // } else {
  //   gameStats.score = 0;
  //   gameStats.collisions++;
  // }
  collide();
  $('.current').find('span').text(gameStats.score);
  $('.collisions').find('span').text(gameStats.collisions);
  $('.high').find('span').text(gameStats.bestScore);
}, 100);

Player.prototype.transform = function(coordinate) {
  this.setX(coordinate.x);
  this.setY(coordinate.y); 
};

// draws the player
d3.select('svg').append('circle').attr('class', 'player').attr('cx', player1.getX()).attr('cy', player1.getY()).attr('r', player1.getR()).attr('fill', 'red');

// Move player dot
// var drag = d3.behavior.drag().on("drag", function(d, i) {
//   d.x += d3.event.dx;
//   d.y += d3.event.dy;
//   var tempx = d.x;
//   var tempy = d.y;

//   player1.setX(this.x);
//   player1.setY(d.y);
//   d3.select(this).attr("transform", function(d,i) {
//     d3.select('player').attr('cx', function(d) {
//       return tempx;
//     }).attr('cy', function(d) {
//       return tempy;
//     });
//     return "translate(" + [d.x,d.y] + ")";
//   });

// });
function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);
d3.select('.player').data([{"x":player1.getX(), "y":player1.getY()}]).call(drag);



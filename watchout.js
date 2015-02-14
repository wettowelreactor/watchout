var Game = function(){
  var obj = {
    "numOfEnemies": 5,
    "bestscore":0,
    "score": 0,
    "intervalID":null
  };

  obj.initalize = function(){
    this.addEnemies();
    this.addPlayer();
    d3.select(window)
      .on('mousemove', function () {
        d3.select('.hero')
          .transition()
          .delay(0)
          .ease('linear')
          .style({
            'left': d3.event.pageX + 'px',
            'top': d3.event.pageY + 'px'
          });
      }
    );

    intervalID = setInterval(this.gameTick.bind(this),950)
  }

  obj.getRandomWidth = function() {
    var width = (Math.random() * window.innerWidth) - 50;
    width = width < 0 ? 0 : width;
    return width;
  };

  obj.getRandomHeight = function() {
    var height = (Math.random() * window.innerHeight) - 50;
      height = height < 0 ? 0 : height;
      return height;
  };

  obj.addPlayer = function() {
    d3.select("body").selectAll(".hero")
      .data(["hero"])
      .enter()
      .append('div')
      .attr('class', 'hero')
      .style('left', function() {
        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));
  };

  obj.addEnemies = function(){
    var enemies = [];
    for(var i = 0; i < this.numOfEnemies ; i++){
      enemies[i] = i;
    }

    d3.select("body").selectAll('.enemy')
      .data(enemies)
      .enter()
      .insert('div')
      .attr('class', 'enemy')
      .style('left', function() {

        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));
  };

  obj.getDistance = function(heroX, heroY, enemyX, enemyY) {
    var distanceX = heroX - enemyX;
    var distanceY = heroY - enemyY;
    var distanceSquared = Math.pow(distanceX, 2) + Math.pow(distanceY, 2);

    return Math.sqrt(distanceSquared);
  };

  obj.detectHit = function(hero, enemy) {
    var heroRadius = 15;
    var enemyRadius = 25;
    var distance = this.getDistance(
      hero.style('left').slice(0,-2),
      hero.style('top').slice(0,-2),
      enemy.style('left').slice(0,-2),
      enemy.style('top').slice(0,-2)
      )
  };

  obj.gameTick = function(){
    d3.selectAll(".enemy")
    .transition()
    .duration(900)
    .style('left', function() {
        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));

  }


  //returns new game element from Game().
  return obj;
}

window.game = Game();
window.game.initalize();

// new function = hitDete
// get radius for user and enemies
// get position for user and enemies
// if (user radius is in same terrority as enemy radius)
// return true
//



var Game = function(){
  var obj = {
    "numOfEnemies": 15,
    "bestscore":0,
    "score": 0,
    "intervalID":null,
    "collisions":0
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
          })
          .attr('class', function(){
            var currentX = d3.select(this).style("left").slice(0,-2);
            if(currentX > d3.event.pageX){
              return 'hero flipped';
            }
            else{
              return 'hero';
            }
          })

          // function (){
          //   debugger;
          //   var currentX = d3.select(this).style("left").slice(0,2);
          //   console.log(currentX);
          //   return true;
      })
    this.handlehit = this.handlehitFactory(this);
    intervalID = setInterval(this.gameTick.bind(this),2000);
    d3.timer(this.detectCollisions.bind(this));
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

  obj.detectCollisions = function() {
    var hero = d3.select('.hero');
    var enemies = d3.selectAll('.enemy');
    var that = this;
    enemies.each(function(){
      var enemy = d3.select(this);
      if (that.detectHit.call(that, hero, enemy)) {
        that.handlehit();
      }
    });
  };

  obj.handlehitFactory = function(context){
    var lastTime = Date.now();
    return function(){
      var currentTime = Date.now();
      if(currentTime - lastTime < 500){
        return;

      } else {
        context.score = 0;
        context.collisions++;
        d3.select(".current").select("span").text("0");
        d3.select(".collisions").select("span").text(context.collisions);
        lastTime = currentTime;
      }
    }

  }


  obj.detectHit = function(hero, enemy) {
    var heroRadius = 25;
    var enemyRadius = 25;
    var distance = this.getDistance(
      hero.style('left').slice(0,-2),
      hero.style('top').slice(0,-2),
      enemy.style('left').slice(0,-2),
      enemy.style('top').slice(0,-2)
    );
    if (distance < (heroRadius + enemyRadius)) {
      return true;
    } else {
      return false;
    }
  };

  obj.gameTick = function(){
    d3.selectAll(".enemy")
    .transition()
    .duration(1990)
    .style('left', function() {
        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));

    this.score += 100;


    d3.select(".current").select("span").text(this.score);
    if(this.score > this.bestscore){
      this.bestscore = this.score
      d3.select(".high").select("span").text(this.bestscore);
    }
  }


  //returns new game element from Game().
  return obj;
}

window.game = Game();
window.game.initalize();




var Game = function(){
  var obj = {
    "numOfEnemies": 1,
    "bestscore":0,
    "score": 0,
    "intervalID":null,
    "collisions":0,
    "gameStarted": false
  };

  obj.initalize = function(){

    d3.select(window)
      .on('click', this.startGame.bind(this));

    this.addEnemies();
    this.addPizza();
    this.handlehit = this.handlehitFactory(this);
  }

  obj.startGame = function () {
    if (!this.gameStarted) {

      d3.select(".title")
        .transition()
        .duration(1000)
        .style("opacity", 0)

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
        })

      this.addPlayer();
      this.intervalID = setInterval(this.gameTick.bind(this),2000);
      d3.timer(this.detectCollisions.bind(this));
    }
  };

  obj.death = function () {
    var hero = d3.select('.hero');
    var x = hero.style('left');

    d3.select(window)
      .on('mousemove', null);

    hero.transition()
      .duration(3000)
      .attr('class', 'hero death')
      .ease('linear')
      .style({
        left: x,
        top: -200 + 'px'
      })

      d3.select(".title")
        .transition()
        .duration(1000)
        .style("opacity", 1)
  };

  obj.stopGame = function () {
    clearInterval(this.intervalID);
    this.death()
    this.gameStarted = false;
    //
  };

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
    var that = this;

    d3.select("body").selectAll(".hero")
      .data(["hero"])
      .attr('class', 'hero')
      .style('left', function() {
        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj))
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

  obj.addEnemy = function() {
    var numEnemy = d3.selectAll('.enemy')[0].length

    d3.selectAll('.enemy')
      .data(d3.range(numEnemy+1))
      .enter()
      .insert("div")
      .attr('class', 'enemy')
      .style('left', function() {

        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));
  };

  obj.addPizza = function(){
    d3.select("body").selectAll(".pizza")
      .data(["pizza"])
      .enter()
      .append('div')
      .attr('class', 'pizza')
      .style('left', function() {
        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));

  }

  obj.movePizza = function(){
    d3.select(".pizza")
      .style('left', function() {
        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));
  }

  obj.getDistance = function(heroX, heroY, enemyX, enemyY) {
    var distanceX = heroX - enemyX;
    var distanceY = heroY - enemyY;
    var distanceSquared = Math.pow(distanceX, 2) + Math.pow(distanceY, 2);

    return Math.sqrt(distanceSquared);
  };

  obj.detectCollisions = function() {
    var hero = d3.select('.hero');
    var enemies = d3.selectAll('.enemy');
    var pizza = d3.selectAll('.pizza');

    var that = this;
    enemies.each(function(){
      var enemy = d3.select(this);
      if (that.detectHit.call(that, hero, enemy)) {
        that.handlehit();
      }
    });
    if(that.detectHit(hero,pizza)){
      this.movePizza();
      this.updateScore();
      this.addEnemy();
    }
  };



  obj.updateScore = function(){
    this.score++;
    d3.select(".current").select("span").text(this.score);
    if(this.score > this.bestscore){
      this.bestscore = this.score
      d3.select(".high").select("span").text(this.bestscore);
    }
  }

  obj.handlehitFactory = function(context){
    var lastTime = Date.now();
    return function(){
      var currentTime = Date.now();
      if(currentTime - lastTime < 500){
        return;

      } else {
        context.score = 0;
        context.collisions++;
        d3.selectAll(".enemy").data([0]).exit().remove();
        d3.select(".current").select("span").text("0");
        d3.select(".collisions").select("span").text(context.collisions);
        lastTime = currentTime;
        d3.select('html')
          .transition()
          .duration(50)
          .style('background-image', "url('nightmare.png')")
          .transition()
          .style('background-image', "url('background.gif')")
        this.stopGame();
        return false;
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
  }


  //returns new game element from Game().
  return obj;
}

window.game = Game();
window.game.initalize();

// title screen
// event listener for click
//
//
//on enemy hit
//stop game and return false




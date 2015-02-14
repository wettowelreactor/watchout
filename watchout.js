// start slingin' some d3 here.

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
    intervalID = setInterval(this.gameTick.bind(this),1000)
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
    d3.selectAll(".hero")
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

    d3.selectAll(".enemy")
      .data(enemies)
      .enter()
      .append('div')
      .attr('class', 'enemy')
      .style('left', function() {

        return this.getRandomWidth() + "px";
      }.bind(obj))
      .style('top', function() {
        return this.getRandomHeight() + "px";
      }.bind(obj));
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

  return obj;
}

window.game = Game();
window.game.initalize();




// start slingin' some d3 here.

var Game = function(){
  var obj = {
    "numOfEnemies": 5,
    "bestscore":0,
    "score": 0
  };

  obj.initalize = function(){
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
        var width = (Math.random() * window.innerWidth) - 50;
        width = width < 0 ? 0 : width;
        return width + "px"
      })
      .style('top', function() {
        var height = (Math.random() * window.innerHeight) - 50;
        height = height < 0 ? 0 : height;
        return height + "px"
      });
  }

  return obj;
}

window.game = Game();
window.game.initalize();

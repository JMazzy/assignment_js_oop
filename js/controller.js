var GAME = GAME || {};


GAME.width = 1600;
GAME.height = 800;
GAME.score = 0;
GAME.playing = true;


GAME.controller = {

  init: function() {
    GAME.model.init(); // generate asteroids

    this.allAsteroids = GAME.asteroidModel.asteroids;
    this.ship = GAME.shipModel.ship;

    GAME.view.init(); // draw asteroids

    setInterval( function() {
      GAME.controller.gameLoop();
    }, 1000 / 60 );
  },

  gameLoop: function() {
    if (GAME.playing) {
      GAME.asteroidModel.update(this.getLasers());
      GAME.laserModel.update();
      GAME.shipModel.update();
    }
    GAME.view.draw();
  },


  turnShip: function(amount) {
    this.ship.rotation += amount;
  },

  accelerateShip: function(amount) {
    var vVector = new Victor( amount, 0 );
    var rotatedV = vVector.rotateDeg( this.ship.direction.horizontalAngleDeg() );

    this.ship.velocity.add(rotatedV);
  },


  shootLaser: function() {
    GAME.laserModel.shootLaser(this.ship);
  },


  getLasers: function() {
    return GAME.laserModel.laserBeams;
  },



}
